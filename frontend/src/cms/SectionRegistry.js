import {
  SECTION_DEFINITIONS,
  createSectionBlueprint,
  getSectionDefinition as getV2SectionDefinition,
  isWidgetSectionType,
} from '../../../shared/cms/sections.js';

export const SECTION_REGISTRY = {
  WheelHero: {
    type: 'WheelHero',
    label: 'Hero Slider 3D',
    icon: 'sparkles',
    defaultContent: {
      products: [
        {
          id: 'sleep-30',
          slug: 'sleep-30-dissolvable-wafers',
          name: 'Sleep 30 Dissolvable Wafers',
          dosage: '250 mg',
          description: "Designed to support a restful night's sleep without the grogginess of traditional sleep aids. Dissolves in seconds.",
          price: 450,
          image: '',
          bgGradient: 'linear-gradient(135deg, #0d1f14, #050e09)',
          accentColor: '#0d1f14',
          options: [30, 60, 90],
        },
        {
          id: 'relax-cbd',
          slug: 'relax-cbd-oral-spray',
          name: 'Relax CBD Oral Spray',
          dosage: '500 mg',
          description: 'A fast-acting oral spray infused with premium CBD and botanical extracts to help you find your calm instantly.',
          price: 520,
          image: '',
          bgGradient: 'linear-gradient(135deg, #1c1917, #0a0908)',
          accentColor: '#1c1917',
          options: [15, 30, 45],
        },
        {
          id: 'vitality-boost',
          slug: 'vitality-boost-tincture',
          name: 'Vitality Boost Tincture',
          dosage: '1000 mg',
          description: 'Recharge your day with our high-potency CBD tincture, blended with energizing terpenes and MCT oil.',
          price: 680,
          image: '',
          bgGradient: 'linear-gradient(135deg, #B87D22, #4A320E)',
          accentColor: '#B87D22',
          options: [30, 60, 120],
        },
      ],
    },
    defaultSettings: { backgroundColor: '#0d1f14' },
    defaultAnimation: { type: 'none' },
    fields: [
      {
        name: 'products',
        label: 'Produits du slider',
        type: 'repeater',
        fields: [
          { name: 'name', label: 'Nom du produit', type: 'text' },
          { name: 'slug', label: 'Slug (URL)', type: 'text' },
          { name: 'dosage', label: 'Dosage / Format', type: 'text' },
          { name: 'description', label: 'Description courte', type: 'textarea' },
          { name: 'price', label: 'Prix (MAD)', type: 'text' },
          { name: 'image', label: 'Image produit', type: 'image' },
          { name: 'bgGradient', label: 'Dégradé fond (CSS)', type: 'text' },
          { name: 'accentColor', label: 'Couleur accent', type: 'color' },
        ],
      },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond par défaut', type: 'color' },
    ],
  },

  Hero: {
    type: 'Hero',
    label: 'Hero Principal',
    icon: 'sparkles',
    defaultContent: {
      title: 'Pureté.',
      subtitle: "L'essence de la",
      description:
        'Une alchimie précieuse entre rituels ancestraux marocains et science moderne.',
    },
    defaultSettings: {
      backgroundColor: '#fcfaf7',
      minHeight: '92vh',
    },
    defaultAnimation: { type: 'fade-up', duration: 1200, delay: 0, triggerOnScroll: false },
    fields: [
      { name: 'title', label: 'Titre principal', type: 'text', required: true },
      { name: 'subtitle', label: 'Sous-titre italique', type: 'text' },
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'titleColor', label: 'Couleur du titre', type: 'color' },
      { name: 'subtitleColor', label: 'Couleur sous-titre', type: 'color' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
      { name: 'minHeight', label: 'Hauteur minimale', type: 'text', placeholder: '92vh' },
    ],
  },

  FeaturesBar: {
    type: 'FeaturesBar',
    label: 'Bandeau défilant',
    icon: 'arrow',
    defaultContent: {
      items: [
        { label: 'Livraison Signature au Maroc' },
        { label: 'Paiement Sécurisé & Chiffré' },
        { label: 'Naturel à 100%' },
        { label: 'Dermatologiquement Testé' },
      ],
    },
    defaultSettings: { backgroundColor: '#1c1917' },
    defaultAnimation: { type: 'none' },
    fields: [
      {
        name: 'items',
        label: 'Éléments du bandeau',
        type: 'repeater',
        fields: [{ name: 'label', label: 'Texte', type: 'text' }],
      },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  CategorySection: {
    type: 'CategorySection',
    label: 'Grille Catégories',
    icon: 'globe',
    defaultContent: { title: 'Explorer par catégorie', subtitle: 'Nos Univers' },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'fade-up', duration: 1000, stagger: 100 },
    fields: [
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre (eyebrow)', type: 'text' },
      {
        name: 'categoryIds',
        label: 'Catégories à afficher',
        type: 'category-selector',
        multiple: true,
      },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  ProductsShowcase: {
    type: 'ProductsShowcase',
    label: 'Vitrine Produits',
    icon: 'star',
    defaultContent: {
      eyebrow: 'Sélection Exclusive',
      title: 'Les Essentiels',
      subtitle: 'du moment.',
      ctaText: 'Voir tous les produits',
      ctaLink: '/shop',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'stagger', duration: 1000, stagger: 100 },
    fields: [
      { name: 'eyebrow', label: 'Petit label', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre italique', type: 'text' },
      { name: 'ctaText', label: 'Texte lien', type: 'text' },
      { name: 'ctaLink', label: 'URL lien', type: 'text' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  StorySection: {
    type: 'StorySection',
    label: 'Section Histoire',
    icon: 'leaf',
    defaultContent: {
      eyebrow: "L'Héritage",
      title: 'Un équilibre entre tradition & innovation.',
      paragraph1:
        "Somacan est né d'une volonté simple : réconcilier les rituels de beauté ancestraux avec les découvertes scientifiques les plus modernes.",
      paragraph2: 'Chaque flacon renferme une alchimie précieuse.',
      badgeText: 'Élégance & Pureté',
      statValue: '5000+',
      statLabel: 'Clients satisfaits',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'fade-left', duration: 1500 },
    fields: [
      { name: 'eyebrow', label: 'Petit label', type: 'text' },
      { name: 'title', label: 'Titre principal', type: 'text' },
      { name: 'paragraph1', label: 'Paragraphe 1', type: 'richtext' },
      { name: 'paragraph2', label: 'Paragraphe 2', type: 'richtext' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'badgeText', label: 'Texte badge', type: 'text' },
      { name: 'statValue', label: 'Valeur statistique', type: 'text' },
      { name: 'statLabel', label: 'Label statistique', type: 'text' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  ExpertiseSection: {
    type: 'ExpertiseSection',
    label: 'Notre Philosophie',
    icon: 'flask',
    defaultContent: {
      eyebrow: 'Notre Philosophie',
      title: "L'excellence du soin,",
      subtitle: 'sans compromis.',
      intro:
        'Chaque pilier de notre méthode est guidé par une seule obsession : vous offrir le meilleur de la nature.',
      items: [
        { num: '01', icon: 'leaf', title: 'Héritage Botanique', desc: 'Des ingrédients rares sourcés au cœur du Maroc.' },
        { num: '02', icon: 'flask', title: 'Science Pure', desc: 'Extraction de pointe garantissant une concentration maximale.' },
        { num: '03', icon: 'sparkles', title: 'Éveil Sensoriel', desc: 'Des textures soyeuses pensées pour une absorption instantanée.' },
        { num: '04', icon: 'shield', title: 'Soin Conscient', desc: 'Un engagement éthique total — cruelty-free, vegan.' },
      ],
    },
    defaultSettings: { backgroundColor: '#1c1917' },
    defaultAnimation: { type: 'stagger', duration: 1200, stagger: 100 },
    fields: [
      { name: 'eyebrow', label: 'Petit label', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre italique', type: 'text' },
      { name: 'intro', label: 'Introduction droite', type: 'textarea' },
      {
        name: 'items',
        label: 'Piliers',
        type: 'repeater',
        fields: [
          { name: 'num', label: 'Numéro', type: 'text' },
          { name: 'icon', label: 'Icône', type: 'icon' },
          { name: 'title', label: 'Titre', type: 'text' },
          { name: 'desc', label: 'Description', type: 'richtext' },
        ],
      },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
      { name: 'textColor', label: 'Couleur texte', type: 'color' },
    ],
  },

  StatsSection: {
    type: 'StatsSection',
    label: 'Section Chiffres',
    icon: 'zap',
    defaultContent: {
      items: [
        { value: 5000, suffix: '+', label: 'Clientes Satisfaites', desc: "Au Maroc & à l'international" },
        { value: 100, suffix: '%', label: 'Actifs Naturels', desc: 'Zéro additif chimique' },
        { value: 4.9, suffix: '★', label: 'Note Moyenne', desc: 'Sur 800+ avis vérifiés' },
        { value: 48, suffix: 'h', label: 'Livraison Express', desc: 'Partout au Maroc' },
      ],
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'stagger', duration: 1200, stagger: 120 },
    fields: [
      {
        name: 'items',
        label: 'Statistiques',
        type: 'repeater',
        fields: [
          { name: 'value', label: 'Valeur', type: 'text' },
          { name: 'suffix', label: 'Suffixe (+, %, ★, h)', type: 'text' },
          { name: 'label', label: 'Label', type: 'text' },
          { name: 'desc', label: 'Description', type: 'text' },
        ],
      },
    ],
    settingsFields: [],
  },

  OfferSection: {
    type: 'OfferSection',
    label: 'Section Offre',
    icon: 'star',
    defaultContent: {
      eyebrow: 'Offre Exceptionnelle',
      title: "L'Éclat d'un",
      subtitle: 'Rituel Rare.',
      description: "Plus qu'un simple soin, une invitation au voyage intérieur.",
      buttonText: 'Rejoindre le cercle',
      buttonLink: '/shop',
      badgeText: 'EXCLUSIVITÉ · PRIVILÈGE · MEMBRES SOMACAN ·',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'fade-right', duration: 1400 },
    fields: [
      { name: 'eyebrow', label: 'Petit label', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre italique', type: 'text' },
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'imageAlt', label: 'Texte alternatif', type: 'text' },
      { name: 'buttonText', label: 'Texte bouton', type: 'text' },
      { name: 'buttonLink', label: 'Lien bouton', type: 'text' },
      { name: 'badgeText', label: 'Texte badge tournant', type: 'text' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  TestimonialsSection: {
    type: 'TestimonialsSection',
    label: 'Témoignages',
    icon: 'heart',
    defaultContent: {
      title: "Ce qu'elles disent",
      subtitle: 'de Somacan.',
      items: [
        {
          quote: "L'huile relaxante Somacan a complètement changé ma routine du soir.",
          author: 'Salma B.',
          city: 'Casablanca',
        },
      ],
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'fade-up', duration: 1000 },
    fields: [
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre italique', type: 'text' },
      {
        name: 'items',
        label: 'Avis clients',
        type: 'repeater',
        fields: [
          { name: 'quote', label: 'Citation', type: 'richtext' },
          { name: 'author', label: 'Auteur', type: 'text' },
          { name: 'city', label: 'Ville', type: 'text' },
        ],
      },
    ],
    settingsFields: [],
  },

  FaqSection: {
    type: 'FaqSection',
    label: 'FAQ',
    icon: 'check',
    defaultContent: {
      eyebrow: 'FAQ',
      headline: 'Questions fréquentes.',
      description:
        'Les réponses essentielles pour comprendre la logique Somacan.',
      ctaText: 'Lire Notre Histoire',
      ctaLink: '/about',
      items: [
        {
          question: 'Les soins Somacan conviennent-ils aux peaux sensibles ?',
          answer: "Oui. L'univers Somacan est pensé autour du confort cutané.",
        },
      ],
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'fade-up', duration: 1000, stagger: 80 },
    fields: [
      { name: 'eyebrow', label: 'Petit label', type: 'text' },
      { name: 'headline', label: 'Titre', type: 'text' },
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'ctaText', label: 'Texte lien', type: 'text' },
      { name: 'ctaLink', label: 'URL lien', type: 'text' },
      {
        name: 'items',
        label: 'Questions/Réponses',
        type: 'repeater',
        fields: [
          { name: 'question', label: 'Question', type: 'text' },
          { name: 'answer', label: 'Réponse', type: 'richtext' },
        ],
      },
    ],
    settingsFields: [],
  },

  NewsletterSection: {
    type: 'NewsletterSection',
    label: 'Newsletter',
    icon: 'sun',
    defaultContent: {
      eyebrow: 'Cercle Privé',
      title: "L'excellence,",
      subtitle: 'en avant-première.',
      description:
        'Rejoignez notre cercle et accédez en exclusivité aux nouvelles collections.',
      placeholder: 'Votre adresse email',
      buttonText: 'Rejoindre',
      successEyebrow: 'Bienvenue dans le cercle',
      successMessage: 'Vous êtes des nôtres.',
      disclaimer: 'Pas de spam · Désinscription libre à tout moment',
    },
    defaultSettings: { backgroundColor: '#1c1917' },
    defaultAnimation: { type: 'fade-up', duration: 1000 },
    fields: [
      { name: 'eyebrow', label: 'Petit label', type: 'text' },
      { name: 'title', label: 'Titre principal', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre italique', type: 'text' },
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'placeholder', label: 'Placeholder email', type: 'text' },
      { name: 'buttonText', label: 'Texte bouton', type: 'text' },
      { name: 'successEyebrow', label: 'Label succès', type: 'text' },
      { name: 'successMessage', label: 'Message succès', type: 'text' },
      { name: 'disclaimer', label: 'Texte légal', type: 'text' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  BlogPreview: {
    type: 'BlogPreview',
    label: 'Aperçu Blog',
    icon: 'moon',
    defaultContent: {
      title: 'Pensées &',
      subtitle: 'inspirations.',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'fade-up', duration: 1000 },
    fields: [
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre italique', type: 'text' },
    ],
    settingsFields: [],
  },
  WidgetSection: {
    type: 'WidgetSection',
    label: SECTION_DEFINITIONS.WidgetSection.label,
    icon: 'layout',
    defaultContent: {},
    defaultSettings: SECTION_DEFINITIONS.WidgetSection.defaultSettings,
    defaultAnimation: { type: 'none' },
    defaultWidgetTree: SECTION_DEFINITIONS.WidgetSection.defaultWidgetTree,
    isWidgetSection: true,
    fields: [],
    settingsFields: [
      { name: 'backgroundColor', label: 'Background color', type: 'color' },
      { name: 'contentWidth', label: 'Content width', type: 'text', placeholder: '1200px' },
      { name: 'gap', label: 'Grid gap', type: 'text', placeholder: '1.5rem' },
      { name: 'columns', label: 'Desktop columns', type: 'text', placeholder: '3' },
    ],
  },
  HeroSectionV2: {
    type: 'HeroSectionV2',
    label: SECTION_DEFINITIONS.HeroSectionV2.label,
    icon: 'sparkles',
    defaultContent: {},
    defaultSettings: SECTION_DEFINITIONS.HeroSectionV2.defaultSettings,
    defaultAnimation: { type: 'none' },
    defaultWidgetTree: SECTION_DEFINITIONS.HeroSectionV2.defaultWidgetTree,
    isWidgetSection: true,
    fields: [],
    settingsFields: [
      { name: 'backgroundColor', label: 'Background color', type: 'color' },
      { name: 'minHeight', label: 'Minimum height', type: 'text', placeholder: '80vh' },
      { name: 'contentWidth', label: 'Content width', type: 'text', placeholder: '1200px' },
      { name: 'gap', label: 'Grid gap', type: 'text', placeholder: '1.5rem' },
      { name: 'columns', label: 'Desktop columns', type: 'text', placeholder: '2' },
    ],
  },
  ProductGridSectionV2: {
    type: 'ProductGridSectionV2',
    label: SECTION_DEFINITIONS.ProductGridSectionV2.label,
    icon: 'grid',
    defaultContent: {},
    defaultSettings: SECTION_DEFINITIONS.ProductGridSectionV2.defaultSettings,
    defaultAnimation: { type: 'none' },
    defaultWidgetTree: SECTION_DEFINITIONS.ProductGridSectionV2.defaultWidgetTree,
    isWidgetSection: true,
    fields: [],
    settingsFields: [
      { name: 'backgroundColor', label: 'Background color', type: 'color' },
      { name: 'contentWidth', label: 'Content width', type: 'text', placeholder: '1200px' },
      { name: 'gap', label: 'Grid gap', type: 'text', placeholder: '1.5rem' },
      { name: 'columns', label: 'Desktop columns', type: 'text', placeholder: '3' },
    ],
  },
  StorySectionV2: {
    type: 'StorySectionV2',
    label: SECTION_DEFINITIONS.StorySectionV2.label,
    icon: 'story',
    defaultContent: {},
    defaultSettings: SECTION_DEFINITIONS.StorySectionV2.defaultSettings,
    defaultAnimation: { type: 'none' },
    defaultWidgetTree: SECTION_DEFINITIONS.StorySectionV2.defaultWidgetTree,
    isWidgetSection: true,
    fields: [],
    settingsFields: [
      { name: 'backgroundColor', label: 'Background color', type: 'color' },
      { name: 'contentWidth', label: 'Content width', type: 'text', placeholder: '1200px' },
      { name: 'gap', label: 'Grid gap', type: 'text', placeholder: '1.5rem' },
      { name: 'columns', label: 'Desktop columns', type: 'text', placeholder: '2' },
    ],
  },
  TestimonialsSectionV2: {
    type: 'TestimonialsSectionV2',
    label: SECTION_DEFINITIONS.TestimonialsSectionV2.label,
    icon: 'testimonial',
    defaultContent: {},
    defaultSettings: SECTION_DEFINITIONS.TestimonialsSectionV2.defaultSettings,
    defaultAnimation: { type: 'none' },
    defaultWidgetTree: SECTION_DEFINITIONS.TestimonialsSectionV2.defaultWidgetTree,
    isWidgetSection: true,
    fields: [],
    settingsFields: [
      { name: 'backgroundColor', label: 'Background color', type: 'color' },
      { name: 'contentWidth', label: 'Content width', type: 'text', placeholder: '1200px' },
      { name: 'gap', label: 'Grid gap', type: 'text', placeholder: '1.5rem' },
      { name: 'columns', label: 'Desktop columns', type: 'text', placeholder: '3' },
    ],
  },
  FAQSectionV2: {
    type: 'FAQSectionV2',
    label: SECTION_DEFINITIONS.FAQSectionV2.label,
    icon: 'faq',
    defaultContent: {},
    defaultSettings: SECTION_DEFINITIONS.FAQSectionV2.defaultSettings,
    defaultAnimation: { type: 'none' },
    defaultWidgetTree: SECTION_DEFINITIONS.FAQSectionV2.defaultWidgetTree,
    isWidgetSection: true,
    fields: [],
    settingsFields: [
      { name: 'backgroundColor', label: 'Background color', type: 'color' },
      { name: 'contentWidth', label: 'Content width', type: 'text', placeholder: '1200px' },
      { name: 'gap', label: 'Grid gap', type: 'text', placeholder: '1.5rem' },
      { name: 'columns', label: 'Desktop columns', type: 'text', placeholder: '1' },
    ],
  },
};

export const SECTION_TYPES = Object.keys(SECTION_REGISTRY);

export function getSectionDef(type) {
  return SECTION_REGISTRY[type] || null;
}

export function getDefaultContent(type) {
  return SECTION_REGISTRY[type]?.defaultContent || {};
}

export function getDefaultSettings(type) {
  return SECTION_REGISTRY[type]?.defaultSettings || {};
}

export function getDefaultWidgetTree(type) {
  const definition = getV2SectionDefinition(type);
  if (!definition) {
    return null;
  }
  return createSectionBlueprint(type)?.widgetTree || [];
}

export function sectionSupportsWidgets(type) {
  return Boolean(SECTION_REGISTRY[type]?.isWidgetSection) || isWidgetSectionType(type);
}
