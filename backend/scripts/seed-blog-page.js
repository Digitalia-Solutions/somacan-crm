import sequelize from '../config/database.js';
import { Page, PageSection } from '../models/index.js';

async function seed() {
  await sequelize.sync();

  const [page] = await Page.findOrCreate({
    where: { slug: 'blog' },
    defaults: {
      title: 'Somacan - Journal',
      template: 'blog',
      isPublished: true,
    },
  });

  await PageSection.destroy({ where: { pageSlug: 'blog' } });

  const sections = [
    {
      pageId: page.id,
      pageSlug: 'blog',
      name: 'Blog Hero',
      type: 'BlogHero',
      order: 10,
      isActive: true,
      content: {
        eyebrow: 'Journal Somacan',
        title: 'Archives &',
        titleItalic: 'rituels éditoriaux.',
        description: "Science botanique, gestes de beauté et inspirations marocaines réunis dans un journal pensé comme une extension du soin.",
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'blog',
      name: 'Blog Grid',
      type: 'BlogGrid',
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

  console.log('Blog page seeded with 2 sections: BlogHero, BlogGrid');
  process.exit();
}

seed();
