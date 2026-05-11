import sequelize from '../config/database.js';
import { Page, PageSection } from '../models/index.js';

async function seed() {
  await sequelize.sync();

  const [page] = await Page.findOrCreate({
    where: { slug: 'shop' },
    defaults: {
      title: 'Somacan - Boutique',
      template: 'shop',
      isPublished: true,
    },
  });

  await PageSection.destroy({ where: { pageSlug: 'shop' } });

  const sections = [
    {
      pageId: page.id,
      pageSlug: 'shop',
      name: 'Shop Hero',
      type: 'ShopHero',
      order: 10,
      isActive: true,
      content: {
        eyebrow: "L'Art du Soin",
        title: 'Boutique',
        titleItalic: 'Holistique.',
        description: "Explorez une collection de soins botaniques d'exception, où chaque flacon renferme l'âme des rituels marocains et la pureté du CBD.",
        heroImage: '/asset/shop-hero-bg.png',
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'shop',
      name: 'Shop Grid',
      type: 'ShopGrid',
      order: 20,
      isActive: true,
      content: {},
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
  ];

  for (const s of sections) {
    await PageSection.create(s);
  }

  console.log('Shop page seeded with 2 sections: ShopHero, ShopGrid');
  process.exit();
}

seed();
