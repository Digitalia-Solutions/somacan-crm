import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import sequelize from '../config/database.js';
import { Page, Menu, SiteContent } from '../models/index.js';

async function seed() {
  try {
    await sequelize.sync();
    console.log('Database synced.');

    // 1. Seed Main Menu
    const [mainMenu, createdMenu] = await Menu.findOrCreate({
      where: { name: 'main' },
      defaults: {
        items: [
          { label: 'Accueil', to: '/' },
          { label: 'Boutique', to: '/shop' },
          { label: 'Notre Histoire', to: '/about' },
          { label: 'Journal', to: '/blog' },
          { label: 'Contact', to: '/contact' },
        ]
      }
    });
    console.log('Main menu seeded.');

    // 2. Seed Home Page
    const [homePage, createdPage] = await Page.findOrCreate({
      where: { slug: 'home' },
      defaults: {
        title: 'Somacan - Accueil',
        description: 'Boutique premium de produits botaniques.',
        template: 'home',
        isPublished: true
      }
    });
    console.log('Home page seeded.');

    // 3. Seed Home Sections (SiteContent)
    const homeSections = [
      {
        pageKey: 'home',
        sectionKey: 'hero',
        contentType: 'hero',
        sortOrder: 10,
        content: {
          type: 'WheelHero',
          products: [
            {
              id: 'sleep-30',
              slug: 'sleep-30-dissolvable-wafers',
              name: "Sleep 30 Dissolvable Wafers",
              dosage: "250 mg",
              description: "Designed to support a restful night's sleep without the grogginess of traditional sleep aids.",
              price: 450,
              image: '/asset/Huile_relaxante_Produit_-removebg-preview.png',
              bgGradient: "from-[#8B2D3A] to-[#4A1D24]",
              accentColor: "#8B2D3A",
              options: [30, 60, 90]
            },
            {
              id: 'relax-cbd',
              slug: 'relax-cbd-oral-spray',
              name: "Relax CBD Oral Spray",
              dosage: "500 mg",
              description: "A fast-acting oral spray infused with premium CBD and botanical extracts.",
              price: 520,
              image: '/asset/Soin-intensif-corps-ARGAN-Produit-2-removebg-preview.png',
              bgGradient: "from-[#033a22] to-[#011a10]",
              accentColor: "#033a22",
              options: [15, 30, 45]
            },
            {
              id: 'vitality-boost',
              slug: 'vitality-boost-tincture',
              name: "Vitality Boost Tincture",
              dosage: "1000 mg",
              description: "Recharge your day with our high-potency CBD tincture, blended with energizing terpenes.",
              price: 680,
              image: '/asset/WhatsApp_Image_2026-05-04_at_14.29.51-removebg-preview.png',
              bgGradient: "from-[#B87D22] to-[#4A320E]",
              accentColor: "#B87D22",
              options: [30, 60, 120]
            }
          ],
          logo: '/asset/cropped-LOGO_SOMACAN_SHOP__1_-removebg-preview.webp'
        }
      },
      {
        pageKey: 'home',
        sectionKey: 'marquee',
        contentType: 'section',
        sortOrder: 20,
        content: { type: 'BrandMarquee' }
      },
      {
        pageKey: 'home',
        sectionKey: 'categories',
        contentType: 'section',
        sortOrder: 30,
        content: { type: 'CategorySection' }
      },
      {
        pageKey: 'home',
        sectionKey: 'showcase',
        contentType: 'section',
        sortOrder: 40,
        content: { type: 'ProductsShowcase' }
      },
      {
        pageKey: 'home',
        sectionKey: 'stats',
        contentType: 'section',
        sortOrder: 50,
        content: { type: 'StatsSection' }
      },
      {
        pageKey: 'home',
        sectionKey: 'split-hero',
        contentType: 'section',
        sortOrder: 60,
        content: { type: 'SplitHeroSection', theme: 'dark' }
      },
      {
        pageKey: 'home',
        sectionKey: 'expertise',
        contentType: 'section',
        sortOrder: 70,
        content: { type: 'ExpertiseSection', theme: 'dark' }
      },
      {
        pageKey: 'home',
        sectionKey: 'offer',
        contentType: 'section',
        sortOrder: 80,
        content: { type: 'OfferSection' }
      },
      {
        pageKey: 'home',
        sectionKey: 'testimonials',
        contentType: 'section',
        sortOrder: 90,
        content: { type: 'TestimonialsSection' }
      },
      {
        pageKey: 'home',
        sectionKey: 'blog-preview',
        contentType: 'section',
        sortOrder: 100,
        content: { type: 'BlogPreview' }
      },
      {
        pageKey: 'home',
        sectionKey: 'faq',
        contentType: 'section',
        sortOrder: 110,
        content: { type: 'FaqSection' }
      },
      {
        pageKey: 'home',
        sectionKey: 'newsletter',
        contentType: 'section',
        sortOrder: 120,
        content: { type: 'NewsletterSection', theme: 'dark' }
      },
      {
        pageKey: 'home',
        sectionKey: 'features',
        contentType: 'section',
        sortOrder: 130,
        content: { type: 'FeaturesBar' }
      }
    ];

    for (const section of homeSections) {
      await SiteContent.findOrCreate({
        where: { pageKey: section.pageKey, sectionKey: section.sectionKey },
        defaults: section
      });
    }
    console.log('Home sections seeded.');

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
