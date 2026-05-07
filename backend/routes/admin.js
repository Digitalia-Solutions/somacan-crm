import express from 'express';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SiteContent from '../models/SiteContent.js';
import ContactSubmission from '../models/ContactSubmission.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import PopupConfig from '../models/PopupConfig.js';
import Page from '../models/Page.js';
import Media from '../models/Media.js';
import ThemeSettings from '../models/ThemeSettings.js';
import HeaderSettings from '../models/HeaderSettings.js';
import FooterSettings from '../models/FooterSettings.js';
import { requireAdmin } from '../middleware/admin.js';
import { getStoreSettings } from '../services/checkout.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.use(requireAdmin);

router.get('/settings/shipping', async (_req, res) => {
  try {
    const settings = await getStoreSettings();
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/settings/shipping', async (req, res) => {
  try {
    const settings = await getStoreSettings();
    const {
      baseShippingCost,
      freeShippingThreshold,
      cityRates,
      allowGuestCheckout,
      guestAccountInviteEnabled,
      currency,
    } = req.body;

    settings.baseShippingCost = baseShippingCost ?? settings.baseShippingCost;
    settings.freeShippingThreshold = freeShippingThreshold ?? settings.freeShippingThreshold;
    settings.cityRates = Array.isArray(cityRates) ? cityRates : settings.cityRates;
    settings.allowGuestCheckout = allowGuestCheckout ?? settings.allowGuestCheckout;
    settings.guestAccountInviteEnabled = guestAccountInviteEnabled ?? settings.guestAccountInviteEnabled;
    settings.currency = currency || settings.currency;
    await settings.save();

    return res.json(settings);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/coupons', async (_req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      code: String(req.body.code || '').trim().toUpperCase(),
    };
    const coupon = await Coupon.create(payload);
    return res.status(201).json(coupon);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    Object.assign(coupon, {
      ...req.body,
      code: req.body.code ? String(req.body.code).trim().toUpperCase() : coupon.code,
    });
    await coupon.save();

    return res.json(coupon);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { guest, converted, status } = req.query;

    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });

    const filteredOrders = orders.filter((order) => {
      if (status && order.status !== status) return false;
      if (guest === 'true' && order.userId) return false;
      if (guest === 'only' && order.userId) return false;
      if (converted === 'true' && !order.guestConvertedAt) return false;
      return true;
    });

    return res.json(filteredOrders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const {
      status,
      paymentStatus,
      notes,
    } = req.body;

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;
    await order.save();

    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Product,
        attributes: ['id']
      }],
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    const categoriesWithCount = categories.map(cat => {
      const plain = cat.get({ plain: true });
      return {
        ...plain,
        productCount: plain.Products ? plain.Products.length : 0
      };
    });

    return res.json(categoriesWithCount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.update(req.body);
    return res.json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/products', async (_req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, required: false }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    return res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/content', async (_req, res) => {
  try {
    const contentItems = await SiteContent.findAll({
      order: [['pageKey', 'ASC'], ['sortOrder', 'ASC'], ['createdAt', 'DESC']],
    });
    return res.json(contentItems);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/content/:pageKey — List sections for a specific page
router.get('/content/:pageKey', async (req, res) => {
  try {
    const sections = await SiteContent.findAll({
      where: { pageKey: req.params.pageKey },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    return res.json(sections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/content/:id — Soft delete a section (set active = false)
router.delete('/content/:id', async (req, res) => {
  try {
    const item = await SiteContent.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Content item not found' });
    }
    await item.update({ active: false });
    return res.json({ message: 'Content section deactivated', id: item.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PATCH /api/admin/content/reorder — Reorder sections via drag-drop
router.patch('/content/reorder', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'items must be an array of { id, sortOrder }' });
    }

    const updates = items.map(({ id, sortOrder }) =>
      SiteContent.update({ sortOrder }, { where: { id } })
    );
    await Promise.all(updates);

    return res.json({ message: 'Reorder successful', count: items.length });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/content', async (req, res) => {
  try {
    const item = await SiteContent.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/content/:id', async (req, res) => {
  try {
    const item = await SiteContent.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Content item not found' });
    }
    await item.update(req.body);
    return res.json(item);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/settings/email', async (_req, res) => {
  try {
    const settings = await getStoreSettings();
    return res.json({
      smtpHost: settings.smtpHost || '',
      smtpPort: settings.smtpPort || 587,
      smtpUser: settings.smtpUser || '',
      smtpPass: settings.smtpPass ? '••••••••' : '',
      mailFrom: settings.mailFrom || '',
      adminEmail: settings.adminEmail || '',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/settings/email', async (req, res) => {
  try {
    const settings = await getStoreSettings();
    const { smtpHost, smtpPort, smtpUser, smtpPass, mailFrom, adminEmail } = req.body;

    settings.smtpHost = smtpHost ?? settings.smtpHost;
    settings.smtpPort = smtpPort ? Number(smtpPort) : settings.smtpPort;
    settings.smtpUser = smtpUser ?? settings.smtpUser;
    // Only update password if a real value sent (not the masked placeholder)
    if (smtpPass && smtpPass !== '••••••••') {
      settings.smtpPass = smtpPass;
    }
    settings.mailFrom = mailFrom ?? settings.mailFrom;
    settings.adminEmail = adminEmail ?? settings.adminEmail;
    await settings.save();

    return res.json({ message: 'Email settings saved.' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/settings/email/test', async (_req, res) => {
  try {
    const { sendContactNotification } = await import('../services/mailer.js');
    const testSubmission = {
      id: 0,
      firstName: 'Test',
      lastName: 'Admin',
      email: (await getStoreSettings()).adminEmail || '',
      phone: '',
      subject: 'Test SMTP',
      message: 'Ceci est un email de test envoyé depuis le panneau admin Somacan.',
      source: 'admin_test',
    };
    if (!testSubmission.email) {
      return res.status(400).json({ message: 'adminEmail non configuré.' });
    }
    await sendContactNotification(testSubmission);
    return res.json({ message: `Email de test envoyé à ${testSubmission.email}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/forms/contact-submissions', async (_req, res) => {
  try {
    const submissions = await ContactSubmission.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.json(submissions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch('/forms/contact-submissions/:id', async (req, res) => {
  try {
    const submission = await ContactSubmission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    await submission.update(req.body);
    return res.json(submission);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const url = `/public/uploads/${req.file.filename}`;
    const media = await Media.create({
      filename: req.file.originalname,
      url,
      mimeType: req.file.mimetype,
      size: req.file.size,
      altText: req.body.altText || '',
      title: req.body.title || req.file.originalname,
      folder: req.body.folder || 'uploads',
    });
    return res.json({ url, id: media.id, filename: media.filename, mimeType: media.mimeType, size: media.size });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ── Newsletter subscribers ────────────────────────────────
router.get('/newsletter/subscribers', async (_req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(subscribers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch('/newsletter/subscribers/:id', async (req, res) => {
  try {
    const sub = await NewsletterSubscriber.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Not found' });
    await sub.update(req.body);
    return res.json(sub);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/newsletter/subscribers/:id', async (req, res) => {
  try {
    const sub = await NewsletterSubscriber.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Not found' });
    await sub.destroy();
    return res.json({ message: 'Deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ── Popup config ──────────────────────────────────────────
router.get('/popup', async (_req, res) => {
  try {
    const [popup] = await PopupConfig.findOrCreate({ where: { name: 'default' }, defaults: { name: 'default' } });
    return res.json(popup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/popup', async (req, res) => {
  try {
    const [popup] = await PopupConfig.findOrCreate({ where: { name: 'default' }, defaults: { name: 'default' } });
    await popup.update(req.body);
    return res.json(popup);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ── Pages admin list/create/update ───────────────────────────
router.get('/pages/list', async (_req, res) => {
  try {
    const pages = await Page.findAll({ order: [['createdAt', 'ASC']] });
    return res.json(pages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/pages/create', async (req, res) => {
  try {
    const { title, slug, description, template, metaTitle, metaDescription, ogImage, canonicalUrl } = req.body;
    if (!title || !slug) return res.status(400).json({ message: 'title and slug are required' });
    const page = await Page.create({ title, slug, description, template, metaTitle, metaDescription, ogImage, canonicalUrl, isPublished: false });
    return res.status(201).json(page);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/pages/:id', async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    await page.update(req.body);
    return res.json(page);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ── Theme Settings ─────────────────────────────────────────────
router.get('/theme', async (_req, res) => {
  try {
    const [theme] = await ThemeSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    return res.json(theme);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/theme', async (req, res) => {
  try {
    const [theme] = await ThemeSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    await theme.update(req.body);
    return res.json(theme);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ── Header Settings ─────────────────────────────────────────────
router.get('/header', requireAdmin, async (_req, res) => {
  try {
    const [header] = await HeaderSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    return res.json(header);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/header', requireAdmin, async (req, res) => {
  try {
    const [header] = await HeaderSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    await header.update(req.body);
    return res.json(header);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// ── Footer Settings ─────────────────────────────────────────────
router.get('/footer', requireAdmin, async (_req, res) => {
  try {
    const [footer] = await FooterSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    return res.json(footer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/footer', requireAdmin, async (req, res) => {
  try {
    const [footer] = await FooterSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    await footer.update(req.body);
    return res.json(footer);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
