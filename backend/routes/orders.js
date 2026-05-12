import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { attachUserIfPresent, requireAuth } from '../middleware/auth.js';
import { buildCheckoutQuote, getStoreSettings, incrementCouponUsage } from '../services/checkout.js';
import { sendGuestOrderEmail } from '../services/mailer.js';

const router = express.Router();

function parseJsonField(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function serializeOrder(order) {
  const plain = order?.toJSON ? order.toJSON() : order;

  return {
    ...plain,
    customer: parseJsonField(plain.customer, {}),
    items: parseJsonField(plain.items, []),
    couponSnapshot: parseJsonField(plain.couponSnapshot, null),
    shippingSnapshot: parseJsonField(plain.shippingSnapshot, null),
  };
}

router.post('/', attachUserIfPresent, async (req, res) => {
  try {
    const {
      customer,
      items,
      paymentMethod = 'cash_on_delivery',
      notes = null,
      couponCode = '',
      createAccountAfterOrder = false,
    } = req.body;

    if (!customer?.firstName || !customer?.lastName || !customer?.email || !customer?.phone || !customer?.address || !customer?.city) {
      return res.status(400).json({ message: 'Missing customer information' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const settings = await getStoreSettings();
    if (!req.user && !settings.allowGuestCheckout) {
      return res.status(400).json({ message: 'Guest checkout is currently disabled.' });
    }

    const { quote, settings: quoteSettings, coupon } = await buildCheckoutQuote({
      items,
      city: customer.city,
      couponCode,
    });

    if (!quote.totalAmount || Number(quote.totalAmount) <= 0) {
      return res.status(400).json({ message: 'Total amount must be greater than 0' });
    }

    const orderAccessToken = crypto.randomBytes(24).toString('hex');
    const shouldInviteGuest = !req.user && Boolean(createAccountAfterOrder) && quoteSettings.guestAccountInviteEnabled;
    const guestAccountToken = shouldInviteGuest ? crypto.randomBytes(24).toString('hex') : null;

    const order = await Order.create({
      userId: req.user?.id || null,
      customer,
      items,
      subtotalAmount: quote.subtotalAmount,
      totalAmount: quote.totalAmount,
      shippingCost: quote.shippingCost,
      discountAmount: quote.discountAmount,
      couponCode: quote.couponCode,
      couponSnapshot: quote.couponSnapshot,
      shippingSnapshot: quote.shippingRule,
      paymentMethod,
      notes,
      paymentStatus: 'pending',
      status: 'pending',
      orderAccessToken,
      guestAccountToken,
    });

    if (quote.couponCode) {
      await incrementCouponUsage(coupon);
    }

    const frontendBaseUrl = process.env.FRONTEND_APP_URL || 'http://localhost:3000';
    const guestPortalUrl = !req.user
      ? `${frontendBaseUrl}/guest/orders/${order.id}?token=${orderAccessToken}`
      : null;
    const accountClaimUrl = guestAccountToken
      ? `${frontendBaseUrl}/claim-account?token=${guestAccountToken}`
      : null;

    if (!req.user) {
      try {
        await sendGuestOrderEmail({
          order,
          trackUrl: guestPortalUrl,
          claimUrl: accountClaimUrl,
          createAccountAfterOrder: shouldInviteGuest,
        });
      } catch (emailError) {
        console.error('Failed to send guest order email:', emailError);
      }
    }

    return res.status(201).json({
      ...serializeOrder(order),
      guestPortalUrl,
      accountClaimUrl,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.json(orders.map(serializeOrder));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/guest/:id', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Guest access token is required' });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order || order.orderAccessToken !== token) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const frontendBaseUrl = process.env.FRONTEND_APP_URL || 'http://localhost:3000';

    return res.json({
      ...serializeOrder(order),
      guestPortalUrl: `${frontendBaseUrl}/guest/orders/${order.id}?token=${token}`,
      accountClaimUrl: order.guestAccountToken
        ? `${frontendBaseUrl}/claim-account?token=${order.guestAccountToken}`
        : null,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(serializeOrder(order));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
