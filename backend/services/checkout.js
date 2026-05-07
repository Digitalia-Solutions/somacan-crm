import Coupon from '../models/Coupon.js';
import StoreSetting from '../models/StoreSetting.js';

function toMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Number(amount.toFixed(2)) : 0;
}

function normalizeCity(value) {
  return String(value || '').trim().toLowerCase();
}

export async function getStoreSettings() {
  const [settings] = await StoreSetting.findOrCreate({
    where: { scope: 'default' },
    defaults: {
      scope: 'default',
      baseShippingCost: 30,
      freeShippingThreshold: 400,
      cityRates: [],
      allowGuestCheckout: true,
      guestAccountInviteEnabled: true,
      currency: 'MAD',
    },
  });

  return settings;
}

export function calculateSubtotal(items = []) {
  return toMoney(items.reduce((sum, item) => (
    sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0)
  ), 0));
}

export function calculateShipping({ subtotal, city, settings }) {
  const baseShippingCost = toMoney(settings.baseShippingCost);
  const freeShippingThreshold = settings.freeShippingThreshold === null
    ? null
    : toMoney(settings.freeShippingThreshold);
  const matchingCityRule = Array.isArray(settings.cityRates)
    ? settings.cityRates.find((entry) => normalizeCity(entry.city) === normalizeCity(city))
    : null;

  let shippingCost = matchingCityRule ? toMoney(matchingCityRule.cost) : baseShippingCost;

  if (freeShippingThreshold !== null && subtotal >= freeShippingThreshold) {
    shippingCost = 0;
  }

  return {
    shippingCost,
    shippingRule: {
      baseShippingCost,
      freeShippingThreshold,
      matchedCity: matchingCityRule?.city || null,
      matchedCityCost: matchingCityRule ? toMoney(matchingCityRule.cost) : null,
    },
  };
}

export async function resolveCoupon({ code, subtotal, shippingCost }) {
  if (!code) {
    return {
      coupon: null,
      discountAmount: 0,
      couponSnapshot: null,
    };
  }

  const normalizedCode = String(code).trim().toUpperCase();
  const coupon = await Coupon.findOne({ where: { code: normalizedCode } });

  if (!coupon || !coupon.active) {
    throw new Error('Coupon invalide ou inactif.');
  }

  const now = new Date();

  if (coupon.startsAt && now < coupon.startsAt) {
    throw new Error('Ce coupon n est pas encore actif.');
  }

  if (coupon.endsAt && now > coupon.endsAt) {
    throw new Error('Ce coupon a expire.');
  }

  if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
    throw new Error('Ce coupon a atteint sa limite d utilisation.');
  }

  const minOrderAmount = toMoney(coupon.minOrderAmount);
  if (subtotal < minOrderAmount) {
    throw new Error(`Ce coupon necessite un minimum de commande de ${minOrderAmount.toFixed(2)} MAD.`);
  }

  let discountAmount = 0;

  if (coupon.type === 'percentage') {
    discountAmount = subtotal * (toMoney(coupon.value) / 100);
  } else if (coupon.type === 'fixed') {
    discountAmount = toMoney(coupon.value);
  } else if (coupon.type === 'free_shipping') {
    discountAmount = shippingCost;
  }

  if (coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined) {
    discountAmount = Math.min(discountAmount, toMoney(coupon.maxDiscountAmount));
  }

  const discountBase = coupon.type === 'free_shipping' ? shippingCost : subtotal;
  discountAmount = Math.min(toMoney(discountAmount), toMoney(discountBase));

  return {
    coupon,
    discountAmount,
    couponSnapshot: {
      code: coupon.code,
      type: coupon.type,
      value: toMoney(coupon.value),
      description: coupon.description,
    },
  };
}

export async function buildCheckoutQuote({ items, city, couponCode }) {
  const settings = await getStoreSettings();
  const subtotalAmount = calculateSubtotal(items);
  const { shippingCost, shippingRule } = calculateShipping({
    subtotal: subtotalAmount,
    city,
    settings,
  });
  const { coupon, discountAmount, couponSnapshot } = await resolveCoupon({
    code: couponCode,
    subtotal: subtotalAmount,
    shippingCost,
  });
  const totalAmount = toMoney(subtotalAmount + shippingCost - discountAmount);

  return {
    settings,
    coupon,
    quote: {
      subtotalAmount,
      shippingCost,
      discountAmount,
      totalAmount,
      couponCode: coupon?.code || null,
      couponSnapshot,
      shippingRule,
      currency: settings.currency,
    },
  };
}

export async function incrementCouponUsage(coupon) {
  if (!coupon) return;
  coupon.usageCount += 1;
  await coupon.save();
}
