const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('somacan_refactor', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const Blog = sequelize.define('Blog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  slug: { type: DataTypes.STRING, unique: true },
  excerpt: DataTypes.TEXT,
  intro: DataTypes.TEXT,
  coverImage: DataTypes.STRING,
  category: DataTypes.STRING,
  readTime: DataTypes.STRING,
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
  publishedAt: DataTypes.DATE,
  sections: DataTypes.JSON,
  content: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'Blogs', timestamps: true });

const newBlogs = [
  {
    title: "L'Huile de Chanvre : Trésor de la Nature au Service de Votre Peau",
    slug: "huile-chanvre-tresor-nature-peau",
    excerpt: "Découvrez comment l'huile de chanvre, riche en oméga-3 et oméga-6, révolutionne les soins de la peau en offrant hydratation, équilibre et protection.",
    intro: "Parmi les huiles végétales les plus précieuses, l'huile de chanvre se distingue par sa composition unique et ses vertus exceptionnelles pour la peau. Issue des graines de Cannabis sativa, elle est dépourvue de THC et offre un équilibre parfait entre acides gras essentiels.",
    coverImage: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    category: "Science",
    readTime: "6 min",
    isPublished: true,
    publishedAt: new Date('2025-03-15'),
    sections: [
      {
        heading: "Une Composition Exceptionnelle",
        body: "L'huile de chanvre présente un ratio idéal d'oméga-6 et d'oméga-3 (3:1), reconnu par les nutritionnistes comme optimal pour la santé cellulaire. Cet équilibre unique lui confère des propriétés anti-inflammatoires remarquables, idéales pour les peaux sensibles ou réactives. Elle contient également des vitamines E et D, de puissants antioxydants qui luttent contre le vieillissement cutané."
      },
      {
        heading: "Hydratation Sans Effet Gras",
        body: "Contrairement aux idées reçues, l'huile de chanvre est non-comédogène. Elle régule la production de sébum sans obstruer les pores, ce qui en fait une alliée précieuse pour les peaux mixtes à grasses. Sa légèreté lui permet d'être absorbée rapidement, laissant la peau douce et veloutée sans résidu huileux."
      },
      {
        heading: "Rituels d'Application Somacan",
        body: "Pour profiter pleinement de ses bienfaits, nous recommandons d'appliquer quelques gouttes d'huile de chanvre sur une peau légèrement humide après la douche. Massez en mouvements circulaires pour activer la microcirculation. Le soir, associez-la à notre sérum CBD pour un effet régénérateur intensif pendant la nuit."
      }
    ]
  },
  {
    title: "Méditation et Soins : Quand le Bien-Être Intérieur Révèle la Beauté Extérieure",
    slug: "meditation-soins-bien-etre-beaute",
    excerpt: "La science confirme ce que les traditions orientales savent depuis millénaires : stress et inflammation sont les premiers ennemis de la peau. La méditation, alliée à des soins naturels, transforme le rituel beauté en art de vivre.",
    intro: "Dans la philosophie Somacan, prendre soin de sa peau ne s'arrête pas aux produits que l'on applique. C'est une démarche holistique qui intègre le corps, l'esprit et l'environnement. La méditation y occupe une place centrale, non comme tendance, mais comme pratique ancestrale validée par la science moderne.",
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    category: "Art de Vivre",
    readTime: "7 min",
    isPublished: true,
    publishedAt: new Date('2025-04-02'),
    sections: [
      {
        heading: "Le Cortisol, Ennemi de la Peau",
        body: "Sous l'effet du stress chronique, notre organisme sécrète du cortisol en excès. Cette hormone déclenche une cascade inflammatoire qui se manifeste sur la peau : rougeurs, poussées d'acné, teint terne, accélération du vieillissement. Des études récentes publiées dans le Journal of Clinical and Aesthetic Dermatology montrent que les pratiques méditatives réduisent significativement le taux de cortisol salivaire en seulement 8 semaines."
      },
      {
        heading: "Intégrer la Pleine Conscience dans son Rituel Beauté",
        body: "La transformation commence dès le premier geste du matin. Plutôt que d'appliquer machinalement votre sérum, prenez trois respirations profondes avant de commencer. Sentez les notes botaniques de vos soins, ressentez la texture sur vos doigts. Ce simple acte d'attention transforme un geste automatique en moment de présence. Vos produits agissent mieux car vous accordez du temps à leur pénétration."
      },
      {
        heading: "Le Programme Somacan Bien-Être",
        body: "Nous avons développé une routine en cinq minutes qui combine soins et respiration consciente. Elle débute par une démaquillant rituel suivi d'un massage facial de deux minutes avec notre huile de chanvre, pendant lequel vous pratiquez la respiration 4-7-8. Cette approche synergique amplifie les effets de nos actifs botaniques tout en apaisant le système nerveux."
      }
    ]
  },
  {
    title: "Le Maroc et ses Plantes Médicinales : Racines d'une Beauté Millénaire",
    slug: "maroc-plantes-medicinales-beaute-millenaire",
    excerpt: "Des souks de Marrakech aux montagnes du Rif, le Maroc abrite une pharmacopée végétale d'une richesse incomparable. Plongée dans l'héritage botanique qui inspire chaque formule Somacan.",
    intro: "La géographie singulière du Maroc — entre Atlantique, Méditerranée, désert et montagnes — a engendré une biodiversité végétale exceptionnelle. Pendant des siècles, les herboristes et les femmes berbères ont transmis oralement un savoir-faire unique qui conjugue tradition et efficacité. Somacan puise dans cet héritage pour créer des soins d'une authenticité rare.",
    coverImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80",
    category: "Héritage",
    readTime: "8 min",
    isPublished: true,
    publishedAt: new Date('2025-04-20'),
    sections: [
      {
        heading: "L'Argan, Or Liquide de l'Anti-Atlas",
        body: "L'huile d'argan, extraite des noix de l'arganier (Argania spinosa), est sans doute la contribution la plus célèbre du Maroc à la cosmétique mondiale. Riche en tocophérols et en acides gras insaturés, elle nourrit, protège et régénère la peau avec une efficacité documentée. Les coopératives féminines du Souss perpétuent un savoir-faire traditionnel d'extraction à froid qui préserve tous les principes actifs."
      },
      {
        heading: "Le Ghassoul, Argile Sacrée du Moyen-Atlas",
        body: "Extrait des mines de la région de Fès, le ghassoul est une argile volcanique rhyolitique aux propriétés purifiantes et adoucissantes uniques. Sa structure minérale particulière lui permet d'absorber les impuretés sans agresser le film hydrolipidique naturel de la peau. Utilisé depuis l'Antiquité dans les hammams royaux, il reste l'un des ingrédients phares de notre gamme purifiante."
      },
      {
        heading: "Le CBD Marocain : Symbole d'une Tradition Réinventée",
        body: "Le Rif abrite l'une des plus anciennes cultures de chanvre du monde. Si l'usage récréatif a longtemps prédominer dans les représentations collectives, c'est l'usage cosmétique du CBD qui retient aujourd'hui l'attention des chercheurs. La légalisation progressive au Maroc ouvre la voie à une filière d'excellence qui permet de combiner l'expertise botanique ancestrale avec les standards de la cosmétique contemporaine — c'est précisément la mission que s'est donnée Somacan."
      }
    ]
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    for (const blogData of newBlogs) {
      const [blog, created] = await Blog.upsert(blogData);
      console.log(`${created ? 'Created' : 'Updated'} blog: ${blogData.slug}`);
    }

    console.log('New blog seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
