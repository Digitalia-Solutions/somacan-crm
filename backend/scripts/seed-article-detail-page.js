import sequelize from '../config/database.js';
import { Page, PageSection } from '../models/index.js';

async function seed() {
  await sequelize.sync();

  const [page] = await Page.findOrCreate({
    where: { slug: 'article-detail' },
    defaults: {
      title: 'Somacan - Article',
      template: 'article-detail',
      isPublished: true,
    },
  });

  await PageSection.destroy({ where: { pageSlug: 'article-detail' } });

  const sections = [
    {
      pageId: page.id,
      pageSlug: 'article-detail',
      name: 'Article Editorial Note',
      type: 'ArticleEditorialNote',
      order: 10,
      isActive: true,
      content: {
        eyebrow: 'Note éditoriale',
        description: "Chaque article du Journal Somacan prolonge l'univers de la marque: botanique marocaine, précision cosmétique et rituels contemporains.",
        ctaText: 'Découvrir Notre Histoire',
        ctaHref: '/about',
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
  ];

  for (const s of sections) {
    await PageSection.create(s);
  }

  console.log('Article detail page seeded with 1 section: ArticleEditorialNote');
  process.exit();
}

seed();
