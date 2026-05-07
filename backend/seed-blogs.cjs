
const { Sequelize, DataTypes } = require('sequelize');

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

    const Blog = sequelize.define('Blog', {
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      excerpt: DataTypes.TEXT,
      intro: DataTypes.TEXT,
      sections: DataTypes.JSON,
      coverImage: DataTypes.STRING,
      category: DataTypes.STRING,
      author: DataTypes.STRING,
      readTime: DataTypes.STRING,
      publishedAt: DataTypes.DATE,
      isPublished: DataTypes.BOOLEAN
    }, { tableName: 'Blogs', timestamps: true });

    const articles = [
      {
        slug: 'cbd-allie-precieux-epiderme',
        title: "Le CBD : L'allié précieux de votre épiderme",
        excerpt: "Découvrez comment cette molécule millénaire révolutionne les soins contemporains.",
        coverImage: "/asset/ChatGPT Image 14 avr. 2026, 14_26_05.png",
        category: 'Science',
        readTime: '5 min',
        publishedAt: '2026-05-05',
        intro: "Le CBD s'impose aujourd'hui comme un actif de soin recherché pour sa douceur, sa stabilité et sa capacité à accompagner les peaux soumises au stress quotidien.",
        sections: [
          {
            heading: 'Pourquoi le CBD intéresse la cosmétique moderne',
            body: "Dans une formule bien construite, le CBD s'associe à des huiles végétales et à des extraits botaniques pour soutenir le confort cutané."
          }
        ],
        isPublished: true
      },
      {
        slug: 'rituels-aube-lumiere-interieure',
        title: "Rituels de l'Aube : Éveiller sa lumière intérieure",
        excerpt: 'Une exploration des gestes simples pour une peau rayonnante dès le réveil.',
        coverImage: "/asset/ChatGPT Image 23 avr. 2026, 12_10_46.png",
        category: 'Art de Vivre',
        readTime: '4 min',
        publishedAt: '2026-04-28',
        intro: "Les premières minutes du matin déterminent souvent la qualité du reste de la journée.",
        sections: [
          {
            heading: 'Commencer par l’eau et le souffle',
            body: "Avant tout soin, un verre d'eau et une respiration lente donnent le ton."
          }
        ],
        isPublished: true
      }
    ];

    for (const article of articles) {
      await Blog.upsert(article);
      console.log(`Upserted blog: ${article.slug}`);
    }

    console.log('Blog seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding blogs:', err);
    process.exit(1);
  }
}

seed();
