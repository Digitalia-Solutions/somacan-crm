import sequelize from '../config/database.js';
import { Page, PageSection } from '../models/index.js';

async function seed() {
  await sequelize.sync();

  const [page] = await Page.findOrCreate({
    where: { slug: 'product-detail' },
    defaults: {
      title: 'Somacan - Produit',
      template: 'product-detail',
      isPublished: true,
    },
  });

  await PageSection.destroy({ where: { pageSlug: 'product-detail' } });

  const sections = [
    {
      pageId: page.id,
      pageSlug: 'product-detail',
      name: 'Related Products',
      type: 'ProductRelated',
      order: 10,
      isActive: true,
      content: {
        eyebrow: 'Dans le même univers',
        title: 'Vous aimerez aussi.',
        maxItems: 4,
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
  ];

  for (const s of sections) {
    await PageSection.create(s);
  }

  console.log('Product detail page seeded with 1 section: ProductRelated');
  process.exit();
}

seed();
