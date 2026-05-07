import sequelize from '../config/database.js';
import Page from '../models/Page.js';
import PageSection from '../models/PageSection.js';
import '../models/index.js';

const HOME_SECTIONS = [
  {
    type: 'Hero',
    name: 'Hero Principal',
    order: 0,
    isActive: true,
    content: {
      title: 'Pureté.',
      subtitle: "L'essence de la",
      description: "Une alchimie précieuse entre rituels ancestraux marocains et science moderne. Des soins d'exception pour une peau véritablement transformée.",
      titleColor: '#043920',
      subtitleColor: '',
    },
    settings: { backgroundColor: '#fcfaf7', minHeight: '92vh' },
    animation: { type: 'fade-up', duration: 1200, delay: 0, triggerOnScroll: false },
    responsive: {},
    seo: {},
  },
  {
    type: 'FeaturesBar',
    name: 'Bandeau Signatures',
    order: 1,
    isActive: true,
    content: {
      items: [
        { label: 'Livraison Signature au Maroc' },
        { label: 'Paiement Sécurisé & Chiffré' },
        { label: 'Expertise Botanique Pure' },
        { label: 'Naturel à 100%' },
        { label: 'Dermatologiquement Testé' },
        { label: 'Éthique & Cruelty-Free' },
        { label: 'Héritage Artisanal' },
      ],
    },
    settings: { backgroundColor: '#1c1917' },
    animation: { type: 'none' },
    responsive: {},
    seo: {},
  },
  {
    type: 'CategorySection',
    name: 'Grille Catégories',
    order: 2,
    isActive: true,
    content: {
      title: 'Explorer par catégorie.',
      subtitle: 'Nos Univers',
    },
    settings: { backgroundColor: '#fcfaf7' },
    animation: { type: 'fade-up', duration: 1000, delay: 0, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
  {
    type: 'ProductsShowcase',
    name: 'Vitrine Produits',
    order: 3,
    isActive: true,
    content: {
      eyebrow: 'Sélection Exclusive',
      title: 'Les Essentiels',
      subtitle: 'du moment.',
      ctaText: 'Voir tous les produits',
      ctaLink: '/shop',
    },
    settings: { backgroundColor: '#fcfaf7' },
    animation: { type: 'stagger-cards', duration: 1000, stagger: 100, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
  {
    type: 'StorySection',
    name: "Notre Histoire",
    order: 4,
    isActive: true,
    content: {
      eyebrow: "L'Héritage",
      title: 'Un équilibre entre tradition & innovation.',
      paragraph1: "Somacan est né d'une volonté simple : réconcilier les rituels de beauté ancestraux avec les découvertes scientifiques les plus modernes.",
      paragraph2: "Chaque flacon renferme une alchimie précieuse. Nous sélectionnons des actifs naturels sourcés localement pour créer des soins qui apaisent l'esprit tout autant que la peau.",
      badgeText: 'Élégance & Pureté',
      statValue: '5000+',
      statLabel: 'Clients satisfaits',
    },
    settings: { backgroundColor: '#fcfaf7' },
    animation: { type: 'fade-left', duration: 1500, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
  {
    type: 'ExpertiseSection',
    name: 'Notre Philosophie',
    order: 5,
    isActive: true,
    content: {
      eyebrow: 'Notre Philosophie',
      title: "L'excellence du soin,",
      subtitle: 'sans compromis.',
      intro: "Chaque pilier de notre méthode est guidé par une seule obsession : vous offrir le meilleur de la nature.",
      items: [
        { num: '01', icon: 'leaf', title: 'Héritage Botanique', desc: 'Des ingrédients rares sourcés au cœur du Maroc, sélectionnés pour leur pureté absolue et leur efficacité prouvée.' },
        { num: '02', icon: 'flask', title: 'Science Pure', desc: 'Extraction de pointe garantissant une concentration maximale des actifs et une stabilité parfaite de chaque formule.' },
        { num: '03', icon: 'sparkles', title: 'Éveil Sensoriel', desc: 'Des textures soyeuses pensées pour une absorption instantanée et une expérience sensorielle unique à chaque application.' },
        { num: '04', icon: 'shield', title: 'Soin Conscient', desc: "Un engagement éthique total — cruelty-free, vegan — pour une beauté respectueuse et responsable." },
      ],
    },
    settings: { backgroundColor: '#1c1917' },
    animation: { type: 'stagger-cards', duration: 1200, stagger: 100, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
  {
    type: 'StatsSection',
    name: 'Chiffres Clés',
    order: 6,
    isActive: true,
    content: {
      items: [
        { value: 5000, suffix: '+', label: 'Clientes Satisfaites', desc: "Au Maroc & à l'international" },
        { value: 100, suffix: '%', label: 'Actifs Naturels', desc: 'Zéro additif chimique' },
        { value: 4.9, suffix: '★', label: 'Note Moyenne', desc: 'Sur 800+ avis vérifiés' },
        { value: 48, suffix: 'h', label: 'Livraison Express', desc: 'Partout au Maroc' },
      ],
    },
    settings: { backgroundColor: '#fcfaf7' },
    animation: { type: 'stagger-cards', duration: 1200, stagger: 120, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
  {
    type: 'TestimonialsSection',
    name: 'Témoignages',
    order: 7,
    isActive: true,
    content: {
      title: "Ce qu'elles disent",
      subtitle: 'de Somacan.',
      items: [
        { quote: "L'huile relaxante Somacan a complètement changé ma routine du soir. La texture est fine, le parfum est subtil et ma peau reste souple jusqu'au matin.", author: 'Salma B.', city: 'Casablanca' },
        { quote: "J'ai rarement vu une marque marocaine avec une identité aussi maîtrisée. Tout paraît calme, cohérent et réellement premium.", author: 'Meryem A.', city: 'Rabat' },
        { quote: "La crème corps à l'argan pénètre vite, sans effet lourd, et laisse une vraie sensation de confort.", author: 'Nadia M.', city: 'Marrakech' },
        { quote: "Ce que j'aime le plus, c'est la sensation de rituel. On n'utilise pas juste un produit, on prend vraiment un moment pour soi.", author: 'Imane K.', city: 'Tanger' },
      ],
    },
    settings: { backgroundColor: '#fcfaf7' },
    animation: { type: 'fade-up', duration: 1000, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
  {
    type: 'FaqSection',
    name: 'Questions Fréquentes',
    order: 8,
    isActive: true,
    content: {
      eyebrow: 'FAQ',
      headline: 'Questions fréquentes.',
      description: 'Les réponses essentielles pour comprendre la logique Somacan, commencer un rituel cohérent et mieux naviguer dans la collection.',
      ctaText: 'Lire Notre Histoire',
      ctaLink: '/about',
      items: [
        { question: 'Les soins Somacan conviennent-ils aux peaux sensibles ?', answer: "Oui. L'univers Somacan est pensé autour du confort cutané, de textures calmes et d'une gestuelle douce." },
        { question: 'Quelle est la différence entre vos huiles, sérums et rituels corps ?', answer: "Les huiles travaillent surtout la nutrition et le toucher, les sérums ciblent davantage la précision du geste et la concentration des actifs." },
        { question: 'Comment commencer une routine Somacan ?', answer: "Le plus simple est de partir d'un geste central: nettoyer, appliquer un soin ciblé, puis sceller avec une texture plus riche si nécessaire." },
        { question: 'Vos produits sont-ils inspirés du patrimoine marocain ?', answer: "Oui. Somacan s'appuie sur les matières, les gestes et l'atmosphère du rituel marocain, puis les traduit dans une écriture plus contemporaine." },
        { question: 'Où puis-je découvrir toute la collection ?', answer: "La boutique regroupe l'ensemble des soins disponibles, tandis que le Journal et la page Notre Histoire expliquent la logique de la marque." },
      ],
    },
    settings: { backgroundColor: '#fcfaf7' },
    animation: { type: 'fade-up', duration: 1000, stagger: 80, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
  {
    type: 'NewsletterSection',
    name: 'Newsletter',
    order: 9,
    isActive: true,
    content: {
      eyebrow: 'Cercle Privé',
      title: "L'excellence,",
      subtitle: 'en avant-première.',
      description: "Rejoignez notre cercle et accédez en exclusivité aux nouvelles collections, rituels secrets et offres réservées à nos membres.",
      placeholder: 'Votre adresse email',
      buttonText: 'Rejoindre',
      successEyebrow: 'Bienvenue dans le cercle',
      successMessage: 'Vous êtes des nôtres.',
      disclaimer: 'Pas de spam · Désinscription libre à tout moment',
    },
    settings: { backgroundColor: '#1c1917' },
    animation: { type: 'fade-up', duration: 1000, triggerOnScroll: true },
    responsive: {},
    seo: {},
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    // Find or create the home page
    const [page] = await Page.findOrCreate({
      where: { slug: 'home' },
      defaults: { slug: 'home', title: 'Accueil', isPublished: true },
    });

    // Check if already seeded
    const existing = await PageSection.count({ where: { pageSlug: 'home' } });
    if (existing > 0) {
      console.log(`Already have ${existing} sections for home. Skipping.`);
      console.log('To re-seed, delete existing PageSection rows for home first.');
      process.exit(0);
    }

    // Insert all sections
    for (const sectionData of HOME_SECTIONS) {
      await PageSection.create({
        pageId: page.id,
        pageSlug: 'home',
        ...sectionData,
      });
      console.log(`✓ Created: ${sectionData.name}`);
    }

    console.log(`\n✅ Home page seeded with ${HOME_SECTIONS.length} sections.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
