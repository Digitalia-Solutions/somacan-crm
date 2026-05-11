import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Import Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import testimonialRoutes from './routes/testimonials.js';
import blogRoutes from './routes/blogs.js';
import authRoutes from './routes/auth.js';
import checkoutRoutes from './routes/checkout.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import pageRoutes from './routes/pages.js';
import menuRoutes from './routes/menus.js';
import pageStyleRoutes from './routes/page-styles.js';
import categoryRoutes from './routes/categories.js';
import newsletterRoutes from './routes/newsletter.js';
import pageSectionRoutes from './routes/page-sections.js';
import mediaRoutes from './routes/media.js';
import menuItemRoutes from './routes/menu-items.js';
import globalStylePresetsRouter from './routes/global-style-presets.js';
import templatesRouter from './routes/templates.js';

// Import Models for Sync
import './models/Product.js';
import './models/Order.js';
import './models/Testimonial.js';
import './models/Blog.js';
import './models/User.js';
import './models/Coupon.js';
import './models/StoreSetting.js';
import './models/Category.js';
import './models/SiteContent.js';
import './models/ContactSubmission.js';
import './models/NewsletterSubscriber.js';
import './models/PopupConfig.js';
import './models/Page.js';
import './models/Menu.js';
import './models/PageStyle.js';
import './models/PageSection.js';
import './models/ThemeSettings.js';
import './models/HeaderSettings.js';
import './models/FooterSettings.js';
import './models/Media.js';
import './models/MenuItem.js';
import './models/GlobalStylePreset.js';
import './models/index.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/admin/pages', pageRoutes);
app.use('/api/admin/page-sections', pageSectionRoutes);
app.use('/api', pageSectionRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/page-styles', pageStyleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/global-style-presets', globalStylePresetsRouter);
app.use('/api/templates', templatesRouter);

// Public theme endpoint (no auth needed - used by frontend for CSS vars)
app.get('/api/theme', async (_req, res) => {
  try {
    const { default: ThemeSettings } = await import('./models/ThemeSettings.js');
    const [theme] = await ThemeSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    return res.json(theme);
  } catch {
    return res.json({});
  }
});

app.get('/api/header', async (_req, res) => {
  try {
    const { default: HeaderSettings } = await import('./models/HeaderSettings.js');
    const [header] = await HeaderSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    return res.json(header);
  } catch {
    return res.json({});
  }
});

app.get('/api/footer', async (_req, res) => {
  try {
    const { default: FooterSettings } = await import('./models/FooterSettings.js');
    const [footer] = await FooterSettings.findOrCreate({ where: { scope: 'default' }, defaults: { scope: 'default' } });
    return res.json(footer);
  } catch {
    return res.json({});
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected');

    await sequelize.sync({ alter: false });
    console.log('Database synced');

    // Sync Page (SEO columns), PageSection (new table) with alter
    const { Page, PageSection, GlobalStylePreset, PageRevision } = await import('./models/index.js');
    const { default: ThemeSettings } = await import('./models/ThemeSettings.js');
    const { default: HeaderSettings } = await import('./models/HeaderSettings.js');
    const { default: FooterSettings } = await import('./models/FooterSettings.js');
    const { default: Media } = await import('./models/Media.js');
    const { default: MenuItem } = await import('./models/MenuItem.js');
    await Page.sync({ alter: true });
    await PageSection.sync({ alter: true });
    await PageRevision.sync({ alter: true });
    await ThemeSettings.sync({ alter: false });
    await HeaderSettings.sync({ alter: false });
    await FooterSettings.sync({ alter: false });
    await Media.sync({ alter: false });
    await MenuItem.sync({ alter: false });
    await GlobalStylePreset.sync({ alter: false });
    console.log('Page + PageSection + PageRevision + ThemeSettings + HeaderSettings + FooterSettings + Media + MenuItem + GlobalStylePreset tables synced');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to MySQL:', err);
    process.exit(1);
  }
}

startServer();
