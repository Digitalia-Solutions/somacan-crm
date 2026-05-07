import express from 'express';
import { buildCheckoutQuote, getStoreSettings } from '../services/checkout.js';

const router = express.Router();

router.get('/config', async (_req, res) => {
  try {
    const settings = await getStoreSettings();

    return res.json({
      currency: settings.currency,
      allowGuestCheckout: settings.allowGuestCheckout,
      guestAccountInviteEnabled: settings.guestAccountInviteEnabled,
      baseShippingCost: Number(settings.baseShippingCost),
      freeShippingThreshold: settings.freeShippingThreshold === null ? null : Number(settings.freeShippingThreshold),
      cityRates: settings.cityRates,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/quote', async (req, res) => {
  try {
    const { items = [], customer = {}, couponCode = '' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const { quote } = await buildCheckoutQuote({
      items,
      city: customer.city,
      couponCode,
    });

    return res.json(quote);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
