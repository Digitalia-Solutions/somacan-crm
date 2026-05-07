import sequelize from '../config/database.js';
import Menu from '../models/Menu.js';
import Page from '../models/Page.js';
import PageStyle from '../models/PageStyle.js';
import SiteContent from '../models/SiteContent.js';

const DEFAULT_MENU_ITEMS = [
  { label: 'Accueil', to: '/' },
  { label: 'Boutique', to: '/shop' },
  { label: 'Notre Histoire', to: '/about' },
  { label: 'Journal', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const DEFAULT_MENU_SETTINGS = {
  logo: '/asset/cropped-LOGO_SOMACAN_SHOP__1_-removebg-preview.webp',
  stickyLogo: '/asset/cropped-LOGO_SOMACAN_SHOP__1_-removebg-preview.webp',
  logoHeight: '48px',
  mobileLogoHeight: '40px',
  position: 'fixed',
  stickyEnabled: true,
  hideOnHomeTop: true,
  navMaxWidth: '100%',
  navItemGap: '40px',
  navFontSize: '11px',
  navLetterSpacing: '0.3em',
  iconSize: '20px',
  mobileNavFontSize: '40px',
  backgroundColor: 'rgba(255,255,255,0.72)',
  stickyBackgroundColor: 'rgba(255,255,255,0.90)',
  linkColor: '#043920B3',
  stickyLinkColor: '#043920',
  iconColor: '#043920',
  stickyIconColor: '#043920',
  hoverBackgroundColor: 'rgba(245,245,244,0.7)',
  mobileBackgroundColor: '#ffffff',
  shadowColor: 'rgba(28,25,23,0.08)',
  backdropBlur: '12px',
  topPadding: '16px',
  stickyTopPadding: '12px',
  customClasses: '',
  customCss: '',
};

const DEFAULT_PAGE_STYLE = {
  fontFamily: '',
  paragraphFontFamily: '',
  headingFontFamily: '',
  textColor: '',
  paragraphColor: '',
  headingColor: '',
  bodyFontSize: '',
  bodyLineHeight: '',
  paragraphFontSize: '',
  paragraphLineHeight: '',
  h1FontSize: '',
  h2FontSize: '',
  h3FontSize: '',
  h4FontSize: '',
  h5FontSize: '',
  h6FontSize: '',
  customCss: '',
};

const HOME_SECTION_DEFAULTS = {
  hero: {
    type: 'WheelHero',
    products: [
      {
        id: 'sleep-30',
        slug: 'sleep-30-dissolvable-wafers',
        name: 'Sleep 30 Dissolvable Wafers',
        dosage: '250 mg',
        description: "Designed to support a restful night's sleep without the grogginess of traditional sleep aids. Dissolves in seconds.",
        price: 450,
        image: '/asset/Huile_relaxante_Produit_-removebg-preview.png',
        bgGradient: 'from-[#8B2D3A] to-[#4A1D24]',
        accentColor: '#8B2D3A',
        options: [30, 60, 90],
      },
      {
        id: 'relax-cbd',
        slug: 'relax-cbd-oral-spray',
        name: 'Relax CBD Oral Spray',
        dosage: '500 mg',
        description: 'A fast-acting oral spray infused with premium CBD and botanical extracts to help you find your calm instantly.',
        price: 520,
        image: '/asset/Soin-intensif-corps-ARGAN-Produit-2-removebg-preview.png',
        bgGradient: 'from-[#033a22] to-[#011a10]',
        accentColor: '#033a22',
        options: [15, 30, 45],
      },
      {
        id: 'vitality-boost',
        slug: 'vitality-boost-tincture',
        name: 'Vitality Boost Tincture',
        dosage: '1000 mg',
        description: 'Recharge your day with our high-potency CBD tincture, blended with energizing terpenes and MCT oil.',
        price: 680,
        image: '/asset/WhatsApp_Image_2026-05-04_at_14.29.51-removebg-preview.png',
        bgGradient: 'from-[#B87D22] to-[#4A320E]',
        accentColor: '#B87D22',
        options: [30, 60, 120],
      },
    ],
  },
  categories: {
    type: 'CategorySection',
  },
  marquee: {
    type: 'BrandMarquee',
    stats: [
      { number: '5,000+', label: 'Clientes Satisfaites' },
      { number: '100%', label: 'Actifs Naturels' },
      { number: '3', label: 'Collections Signature' },
      { number: '0%', label: 'Additifs Chimiques' },
      { number: '4.9★', label: 'Note Moyenne' },
      { number: '48h', label: 'Livraison Express' },
    ],
    certifications: [
      { label: '✦ Certifié Halal' },
      { label: '✦ Cruelty-Free' },
      { label: '✦ Vegan Friendly' },
      { label: '✦ Dermatologiquement Testé' },
      { label: '✦ Fabriqué au Maroc' },
      { label: '✦ ISO 22716' },
      { label: '✦ Sans Parabènes' },
      { label: '✦ CBD de Grade Médicinal' },
    ],
  },
  showcase: {
    type: 'ProductsShowcase',
    eyebrow: 'Sélection Exclusive',
    title: 'Les Essentiels',
    subtitle: 'du moment.',
    ctaText: 'Voir tous les produits',
    ctaLink: '/shop',
  },
  stats: {
    type: 'StatsSection',
    items: [
      { value: 5000, suffix: '+', label: 'Clientes Satisfaites', desc: "Au Maroc & à l'international" },
      { value: 100, suffix: '%', label: 'Actifs Naturels', desc: 'Zéro additif chimique' },
      { value: 4.9, suffix: '★', label: 'Note Moyenne', desc: 'Sur 800+ avis vérifiés' },
      { value: 48, suffix: 'h', label: 'Livraison Express', desc: 'Partout au Maroc' },
    ],
  },
  'split-hero': {
    type: 'SplitHeroSection',
    theme: 'dark',
    items: [
      {
        image: '/asset/ChatGPT Image 29 avr. 2026, 12_21_25.png',
        tag: 'Collection Visage',
        title: 'Éclat\n& Pureté',
        description: "Des soins raffinés formulés à l'essence du Maroc pour une peau lumineuse.",
        cta: 'Découvrir',
        slug: '/shop',
      },
      {
        image: '/asset/ChatGPT Image 14 avr. 2026, 21_04_48.png',
        tag: 'Collection Corps',
        title: 'Douceur\nAbsolue',
        description: "Rituels corps d'exception pour une peau nourrie, soyeuse et visiblement transformée.",
        cta: 'Explorer',
        slug: '/shop',
      },
    ],
  },
  expertise: {
    type: 'ExpertiseSection',
    eyebrow: 'Notre Philosophie',
    title: "L'excellence du soin,",
    subtitle: 'sans compromis.',
    intro: 'Chaque pilier de notre méthode est guidé par une seule obsession : vous offrir le meilleur de la nature.',
    items: [
      { num: '01', icon: 'leaf', title: 'Héritage Botanique', description: 'Des ingrédients rares sourcés au cœur du Maroc, sélectionnés pour leur pureté absolue et leur efficacité prouvée.' },
      { num: '02', icon: 'flask', title: 'Science Pure', description: 'Extraction de pointe garantissant une concentration maximale des actifs et une stabilité parfaite de chaque formule.' },
      { num: '03', icon: 'sparkles', title: 'Éveil Sensoriel', description: 'Des textures soyeuses pensées pour une absorption instantanée et une expérience sensorielle unique à chaque application.' },
      { num: '04', icon: 'shield', title: 'Soin Conscient', description: 'Un engagement éthique total — cruelty-free, vegan, certifié halal — pour une beauté respectueuse et responsable.' },
    ],
  },
  offer: {
    type: 'OfferSection',
    eyebrow: 'Offre Exceptionnelle',
    title: "L’Éclat d'un",
    subtitle: 'Rituel Rare.',
    description: "Plus qu'un simple soin, une invitation au voyage intérieur. Profitez de notre rituel corps signature, une édition limitée conçue pour l'apaisement absolu.",
    image: '/asset/ChatGPT Image 29 avr. 2026, 12_21_25.png',
    imageAlt: 'Rituel Somacan',
    buttonText: 'Rejoindre le cercle',
    buttonLink: '/shop',
    badgeText: 'EXCLUSIVITÉ · PRIVILÈGE · MEMBRES SOMACAN ·',
  },
  testimonials: {
    type: 'TestimonialsSection',
    title: "Ce qu'elles disent",
    subtitle: 'de Somacan.',
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
      },
      {
        quote: "Ce que j'aime le plus, c'est la sensation de rituel. On n'utilise pas juste un produit, on prend vraiment un moment pour soi.",
        author: 'Imane K.',
        city: 'Tanger',
      },
    ],
  },
  faq: {
    type: 'FaqSection',
    eyebrow: 'FAQ',
    headline: 'Questions fréquentes.',
    description: 'Les réponses essentielles pour comprendre la logique Somacan, commencer un rituel cohérent et mieux naviguer dans la collection.',
    ctaText: 'Lire Notre Histoire',
    ctaLink: '/about',
    items: [
      {
        question: 'Les soins Somacan conviennent-ils aux peaux sensibles ?',
        answer: "Oui. L'univers Somacan est pensé autour du confort cutané, de textures calmes et d'une gestuelle douce. Cela ne remplace pas un diagnostic dermatologique, mais la marque privilégie une approche mesurée et sensorielle.",
      },
      {
        question: 'Quelle est la différence entre vos huiles, sérums et rituels corps ?',
        answer: "Les huiles travaillent surtout la nutrition et le toucher, les sérums ciblent davantage la précision du geste et la concentration des actifs, tandis que les rituels corps prolongent l'expérience dans une logique plus enveloppante et quotidienne.",
      },
      {
        question: 'Comment commencer une routine Somacan ?',
        answer: "Le plus simple est de partir d'un geste central: nettoyer, appliquer un soin ciblé, puis sceller avec une texture plus riche si nécessaire. Une routine courte mais régulière donne généralement plus de cohérence qu'une accumulation de produits.",
      },
      {
        question: 'Vos produits sont-ils inspirés du patrimoine marocain ?',
        answer: "Oui. Somacan s'appuie sur les matières, les gestes et l'atmosphère du rituel marocain, puis les traduit dans une écriture plus contemporaine, plus minimale et plus précise.",
      },
      {
        question: 'Où puis-je découvrir toute la collection ?',
        answer: "La boutique regroupe l'ensemble des soins disponibles, tandis que le Journal et la page Notre Histoire expliquent la logique de la marque, ses inspirations et la façon d'intégrer chaque produit dans un rituel réel.",
      },
    ],
  },
  newsletter: {
    type: 'NewsletterSection',
    theme: 'dark',
    eyebrow: 'Cercle Privé',
    title: "L'excellence,",
    subtitle: 'en avant-première.',
    description: 'Rejoignez notre cercle et accédez en exclusivité aux nouvelles collections, rituels secrets et offres réservées à nos membres.',
    placeholder: 'Votre adresse email',
    buttonText: 'Rejoindre',
    successEyebrow: 'Bienvenue dans le cercle',
    successMessage: 'Vous êtes des nôtres.',
    disclaimer: 'Pas de spam · Désinscription libre à tout moment',
  },
  features: {
    type: 'FeaturesBar',
    items: [
      { label: 'Livraison Signature au Maroc' },
      { label: 'Paiement Sécurisé & Chiffré' },
      { label: 'Expertise Botanique Pure' },
      { label: 'CBD de Grade Médicinal' },
      { label: 'Héritage Artisanal' },
      { label: 'Éthique & Cruelty-Free' },
      { label: 'Naturel à 100%' },
      { label: 'Dermatologiquement Testé' },
    ],
  },
};

const HOME_SECTION_LAYOUT = [
  { sectionKey: 'hero', contentType: 'hero', sortOrder: 10, active: true },
  { sectionKey: 'marquee', contentType: 'section', sortOrder: 20, active: true },
  { sectionKey: 'categories', contentType: 'section', sortOrder: 30, active: true },
  { sectionKey: 'showcase', contentType: 'section', sortOrder: 40, active: true },
  { sectionKey: 'stats', contentType: 'section', sortOrder: 50, active: true },
  { sectionKey: 'split-hero', contentType: 'section', sortOrder: 60, active: true },
  { sectionKey: 'expertise', contentType: 'section', sortOrder: 70, active: true },
  { sectionKey: 'offer', contentType: 'section', sortOrder: 80, active: true },
  { sectionKey: 'testimonials', contentType: 'section', sortOrder: 90, active: true },
  { sectionKey: 'blog-preview', contentType: 'section', sortOrder: 100, active: true },
  { sectionKey: 'faq', contentType: 'section', sortOrder: 110, active: true },
  { sectionKey: 'newsletter', contentType: 'section', sortOrder: 120, active: true },
  { sectionKey: 'features', contentType: 'section', sortOrder: 130, active: true },
];

function mergeContent(existing, defaults) {
  const base = existing && typeof existing === 'object' ? { ...existing } : {};
  for (const [key, value] of Object.entries(defaults)) {
    const currentValue = base[key];
    if (Array.isArray(value)) {
      if (!Array.isArray(currentValue) || currentValue.length === 0) {
        base[key] = value;
      }
      continue;
    }
    if (value && typeof value === 'object') {
      base[key] = mergeContent(currentValue, value);
      continue;
    }
    if (currentValue === undefined || currentValue === null || currentValue === '') {
      base[key] = value;
    }
  }
  return base;
}

async function seedMenu() {
  const [menu] = await Menu.findOrCreate({
    where: { name: 'main' },
    defaults: {
      name: 'main',
      items: {
        items: DEFAULT_MENU_ITEMS,
        settings: DEFAULT_MENU_SETTINGS,
      },
    },
  });

  const rawItems = Array.isArray(menu.items) ? menu.items : (Array.isArray(menu.items?.items) ? menu.items.items : []);
  const rawSettings = Array.isArray(menu.items) ? {} : (menu.items?.settings || {});

  menu.items = {
    items: rawItems.length > 0 ? rawItems : DEFAULT_MENU_ITEMS,
    settings: { ...DEFAULT_MENU_SETTINGS, ...rawSettings },
  };
  await menu.save();
}

async function seedPageStyles() {
  const pages = await Page.findAll();
  for (const page of pages) {
    const [pageStyle] = await PageStyle.findOrCreate({
      where: { pageKey: page.slug },
      defaults: { styles: DEFAULT_PAGE_STYLE },
    });
    pageStyle.styles = { ...DEFAULT_PAGE_STYLE, ...(pageStyle.styles || {}) };
    await pageStyle.save();
  }
}

const STRICT_HOME_SECTIONS = new Set(['hero', 'marquee', 'showcase', 'stats', 'split-hero', 'expertise', 'offer', 'testimonials', 'faq', 'newsletter', 'features']);

async function seedHomeSections() {
  for (const layout of HOME_SECTION_LAYOUT) {
    const [section] = await SiteContent.findOrCreate({
      where: { pageKey: 'home', sectionKey: layout.sectionKey },
      defaults: {
        pageKey: 'home',
        sectionKey: layout.sectionKey,
        contentType: layout.contentType,
        sortOrder: layout.sortOrder,
        active: layout.active,
        content: HOME_SECTION_DEFAULTS[layout.sectionKey] || {},
      },
    });

    const defaults = HOME_SECTION_DEFAULTS[layout.sectionKey];

    section.contentType = layout.contentType;
    section.sortOrder = layout.sortOrder;
    section.active = layout.active;

    if (defaults) {
      section.content = STRICT_HOME_SECTIONS.has(layout.sectionKey)
        ? defaults
        : mergeContent(section.content, defaults);
    }

    await section.save();
  }
}

async function main() {
  try {
    await sequelize.authenticate();
    await seedMenu();
    await seedPageStyles();
    await seedHomeSections();
    console.log('CMS defaults seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed CMS defaults:', error);
    process.exit(1);
  }
}

main();
