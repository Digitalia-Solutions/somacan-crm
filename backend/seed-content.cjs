
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'somacan_refactor',
  logging: false
});

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const SiteContent = sequelize.define('SiteContent', {
      sectionKey: { type: DataTypes.STRING, primaryKey: true },
      pageKey: DataTypes.STRING,
      contentType: DataTypes.STRING,
      content: DataTypes.JSON,
      sortOrder: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN
    }, { tableName: 'SiteContents', timestamps: true });

    const data = [
      {
        sectionKey: 'hero',
        content: {
          type: 'WheelHero',
          products: [
            {
              id: 'sleep-30',
              name: "Sleep 30 Dissolvable Wafers",
              dosage: "250 mg",
              description: "Designed to support a restful night's sleep without the grogginess of traditional sleep aids. Dissolves in seconds.",
              price: 450,
              image: "/asset/Huile_relaxante_Produit_-removebg-preview.png",
              bgGradient: "from-[#8B2D3A] to-[#4A1D24]",
              accentColor: "#8B2D3A",
              options: [30, 60, 90]
            },
            {
              id: 'relax-cbd',
              name: "Relax CBD Oral Spray",
              dosage: "500 mg",
              description: "A fast-acting oral spray infused with premium CBD and botanical extracts to help you find your calm instantly.",
              price: 520,
              image: "/asset/Soin-intensif-corps-ARGAN-Produit-2-removebg-preview.png",
              bgGradient: "from-[#033a22] to-[#011a10]",
              accentColor: "#033a22",
              options: [15, 30, 45]
            },
            {
              id: 'vitality-boost',
              name: "Vitality Boost Tincture",
              dosage: "1000 mg",
              description: "Recharge your day with our high-potency CBD tincture, blended with energizing terpenes and MCT oil.",
              price: 680,
              image: "/asset/WhatsApp_Image_2026-05-04_at_14.29.51-removebg-preview.png",
              bgGradient: "from-[#B87D22] to-[#4A320E]",
              accentColor: "#B87D22",
              options: [30, 60, 120]
            }
          ]
        }
      },
      {
        sectionKey: 'stats',
        content: {
          type: 'StatsSection',
          items: [
            { value: '5000', label: 'Clientes Satisfaites', icon: '+' },
            { value: '100', label: 'Actifs Naturels', icon: '%' },
            { value: '4.9', label: 'Note Moyenne', icon: '★' },
            { value: '48', label: 'Livraison Express', icon: 'h' }
          ]
        }
      },
      {
        sectionKey: 'testimonials',
        content: {
          type: 'TestimonialsSection',
          title: "Ce qu'elles disent",
          subtitle: "de Somacan.",
          items: [
            {
              quote: "L'huile relaxante Somacan a complètement changé ma routine du soir. La texture est fine, le parfum est subtil et ma peau reste souple jusqu'au matin.",
              author: 'Salma B.',
              city: 'Casablanca',
            },
            {
              quote: "J'ai rarement vu une marque marocaine avec une identité aussi maîtrisée. Tout paraît calme, cohérent et réellement premium, du produit jusqu'à l'expérience.",
              author: 'Meryem A.',
              city: 'Rabat',
            },
            {
              quote: "La crème corps à l'argan pénètre vite, sans effet lourd, et laisse une vraie sensation de confort. C'est le type de soin qu'on rachète sans hésiter.",
              author: 'Nadia M.',
              city: 'Marrakech',
            }
          ]
        }
      },
      {
        sectionKey: 'faq',
        content: {
          type: 'FaqSection',
          headline: "Questions Frequentes",
          items: [
            {
              question: "Vos produits sont-ils 100% naturels ?",
              answer: "Oui, tous nos produits sont formulés avec des ingrédients d'origine naturelle, sans parabènes ni sulfates."
            },
            {
              question: "Quels sont les délais de livraison ?",
              answer: "Nous livrons partout au Maroc en 24h à 48h ouvrables."
            }
          ]
        }
      },
      {
        sectionKey: 'expertise',
        content: {
          type: 'ExpertiseSection',
          items: [
            { title: "Savoir-faire Ancestral", description: "Nos formules s'inspirent des rituels de beauté marocains transmis de génération en génération." },
            { title: "Innovation Scientifique", description: "Nous utilisons les dernières avancées en biotechnologie pour maximiser l'efficacité de nos actifs." },
            { title: "Engagement Éthique", description: "Nous privilégions les circuits courts et le commerce équitable avec les coopératives locales." }
          ]
        }
      }
    ];

    for (const item of data) {
      await SiteContent.update(
        { content: item.content },
        { where: { sectionKey: item.sectionKey } }
      );
      console.log(`Updated ${item.sectionKey}`);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

seed();
