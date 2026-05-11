const path = require('path');
const sequelize = require('../config/database.js');
const { Page, PageSection } = require('../models/index.js');

async function seed() {
  await sequelize.sync();
  
  const [page] = await Page.findOrCreate({
    where: { slug: 'contact' },
    defaults: {
      title: 'Somacan - Contact',
      template: 'contact',
      isPublished: true
    }
  });

  const sections = [
    {
      pageSlug: 'contact',
      type: 'ContactHero',
      order: 10,
      content: {
        title: 'Une conversation calme et précise.',
        description: 'Que vous ayez une question sur une routine, un besoin de recommandation, un suivi de commande ou une demande de collaboration, nous vous répondons avec le même niveau d\'attention que nos soins.',
        cards: [
          { label: 'Telephone', value: '+212 5XX-XXXXXX', detail: 'Lundi au samedi, 9h00 a 19h00', icon: 'Phone' },
          { label: 'Email', value: 'contact@somacan.ma', detail: 'Reponse moyenne en moins de 24h', icon: 'Mail' },
          { label: 'Showroom', value: 'Casablanca, Maroc', detail: 'Rendez-vous prive sur demande', icon: 'MapPin' }
        ]
      }
    },
    {
      pageSlug: 'contact',
      type: 'ContactForm',
      order: 20,
      content: { title: 'Envoyez-nous votre message.' }
    }
  ];

  for (const s of sections) {
    await PageSection.create(s);
  }
  console.log('Contact page seeded.');
  process.exit();
}
seed();
