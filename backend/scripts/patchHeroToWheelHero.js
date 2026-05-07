import sequelize from '../config/database.js';
import PageSection from '../models/PageSection.js';
import '../models/index.js';

const WHEEL_HERO_CONTENT = {
  products: [
    {
      id: 'sleep-30',
      slug: 'sleep-30-dissolvable-wafers',
      name: 'Sleep 30 Dissolvable Wafers',
      dosage: '250 mg',
      description: "Designed to support a restful night's sleep without the grogginess of traditional sleep aids.",
      price: 450,
      image: '/public/asset/Huile_relaxante_Produit_-removebg-preview.png',
      bgGradient: 'linear-gradient(135deg, #0d1f14, #050e09)',
      accentColor: '#0d1f14',
      options: [30, 60, 90],
    },
    {
      id: 'relax-cbd',
      slug: 'relax-cbd-oral-spray',
      name: 'Relax CBD Oral Spray',
      dosage: '500 mg',
      description: 'A fast-acting oral spray infused with premium CBD and botanical extracts to help you find your calm instantly.',
      price: 520,
      image: '/public/asset/Soin-intensif-corps-ARGAN-Produit-2-removebg-preview.png',
      bgGradient: 'linear-gradient(135deg, #1c1917, #0a0908)',
      accentColor: '#1c1917',
      options: [15, 30, 45],
    },
    {
      id: 'vitality-boost',
      slug: 'vitality-boost-tincture',
      name: 'Vitality Boost Tincture',
      dosage: '1000 mg',
      description: 'Recharge your day with our high-potency CBD tincture, blended with energizing terpenes and MCT oil.',
      price: 680,
      image: '/public/asset/WhatsApp_Image_2026-05-04_at_14.29.51-removebg-preview.png',
      bgGradient: 'linear-gradient(135deg, #B87D22, #4A320E)',
      accentColor: '#B87D22',
      options: [30, 60, 120],
    },
  ],
};

async function patch() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    // Find the Hero section for the home page
    const heroSection = await PageSection.findOne({
      where: { pageSlug: 'home', type: 'Hero' },
    });

    if (!heroSection) {
      console.log('No Hero section found for home page. Checking for existing WheelHero...');
      const existing = await PageSection.findOne({ where: { pageSlug: 'home', type: 'WheelHero' } });
      if (existing) {
        console.log('WheelHero already exists. Nothing to do.');
      } else {
        console.error('No Hero or WheelHero found. Run seedHomeSections.js first.');
      }
      process.exit(0);
    }

    await heroSection.update({
      type: 'WheelHero',
      name: 'Hero Slider 3D',
      content: WHEEL_HERO_CONTENT,
      settings: { backgroundColor: '#0d1f14' },
      animation: { type: 'none' },
    });

    console.log('✅ Hero section patched to WheelHero successfully.');
    console.log('   Section ID:', heroSection.id, '| Page:', heroSection.pageSlug);
    process.exit(0);
  } catch (error) {
    console.error('Patch error:', error.message);
    process.exit(1);
  }
}

patch();
