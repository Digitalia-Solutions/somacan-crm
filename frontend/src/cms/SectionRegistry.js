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

  // ── Shop ────────────────────────────────────────────────────────────────────

  ShopHero: {
    type: 'ShopHero',
    label: 'Shop — Hero',
    icon: 'sparkles',
    defaultContent: {
      eyebrow: "L'Art du Soin",
      title: 'Boutique',
      titleItalic: 'Holistique.',
      description: "Explorez une collection de soins botaniques d'exception, où chaque flacon renferme l'âme des rituels marocains et la pureté du CBD.",
      heroImage: '/asset/background Univers catégories.png',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'title', label: 'Titre ligne 1', type: 'text' },
      { name: 'titleItalic', label: 'Titre ligne 2 (italique)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'heroImage', label: 'Image de fond', type: 'image' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  ShopGrid: {
    type: 'ShopGrid',
    label: 'Shop — Grille produits + filtres',
    icon: 'grid',
    defaultContent: {
      initialCategory: 'all',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  // ── About ────────────────────────────────────────────────────────────────────

  AboutHero: {
    type: 'AboutHero',
    label: 'About — Hero',
    icon: 'story',
    defaultContent: {
      eyebrow: 'Notre Histoire',
      title: 'Un soin ne nait pas',
      titleItalic: "d'une tendance.",
      description1: "Somacan est ne d'une conviction simple: la beaute peut etre a la fois precise, sensorielle et profonde. Nous voulions une marque capable de parler du Maroc sans caricature, du soin sans agitation, et du luxe sans demonstration forcee.",
      description2: "L'ambition n'etait pas de produire une ligne cosmetique de plus, mais de construire un langage complet autour du rituel: la matiere, le geste, l'image, le silence, la duree.",
      ctaPrimaryText: 'Explorer la boutique',
      ctaPrimaryHref: '/shop',
      ctaSecondaryText: 'Lire le Journal',
      ctaSecondaryHref: '/blog',
      stat1Value: '3', stat1Label: 'piliers',
      stat2Value: '1', stat2Label: 'vision claire',
      stat3Value: '∞', stat3Label: 'gestes possibles',
      heroImage: '/asset/ChatGPT Image 29 avr. 2026, 15_06_48 (3).png',
      badgeLabel: 'Signature',
      badgeText: 'Calme. Matiere. Precision.',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Titre ligne 1', type: 'text' },
      { name: 'titleItalic', label: 'Titre ligne 2 (italique)', type: 'text' },
      { name: 'description1', label: 'Paragraphe 1', type: 'textarea' },
      { name: 'description2', label: 'Paragraphe 2', type: 'textarea' },
      { name: 'ctaPrimaryText', label: 'CTA principal', type: 'text' },
      { name: 'ctaPrimaryHref', label: 'CTA principal lien', type: 'text' },
      { name: 'ctaSecondaryText', label: 'CTA secondaire', type: 'text' },
      { name: 'ctaSecondaryHref', label: 'CTA secondaire lien', type: 'text' },
      { name: 'stat1Value', label: 'Stat 1 valeur', type: 'text' },
      { name: 'stat1Label', label: 'Stat 1 label', type: 'text' },
      { name: 'stat2Value', label: 'Stat 2 valeur', type: 'text' },
      { name: 'stat2Label', label: 'Stat 2 label', type: 'text' },
      { name: 'stat3Value', label: 'Stat 3 valeur', type: 'text' },
      { name: 'stat3Label', label: 'Stat 3 label', type: 'text' },
      { name: 'heroImage', label: 'Image hero', type: 'image' },
      { name: 'badgeLabel', label: 'Badge label', type: 'text' },
      { name: 'badgeText', label: 'Badge texte', type: 'text' },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  AboutPrinciples: {
    type: 'AboutPrinciples',
    label: 'About — Principes (3 cartes)',
    icon: 'leaf',
    defaultContent: {
      principles: [
        { icon: 'Leaf', title: 'Botanique situee', text: "Nous partons d'un territoire, d'un rythme et d'un geste avant de parler de produit. La matiere n'est jamais deconnectee de son univers." },
        { icon: 'FlaskConical', title: 'Formules lisibles', text: "Somacan cherche des textures claires, sensorielles et immediates. Le luxe, ici, ne vient pas de l'exces mais de la precision." },
        { icon: 'Sparkles', title: 'Rituel contemporain', text: "Chaque soin doit pouvoir entrer dans une vraie vie, avec une sensation juste, une application simple et une memoire durable." },
      ],
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      {
        name: 'principles',
        label: 'Principes',
        type: 'repeater',
        fields: [
          { name: 'icon', label: 'Icône (Leaf / FlaskConical / Sparkles)', type: 'text' },
          { name: 'title', label: 'Titre', type: 'text' },
          { name: 'text', label: 'Texte', type: 'textarea' },
        ],
      },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  AboutManifeste: {
    type: 'AboutManifeste',
    label: 'About — Manifeste',
    icon: 'shield',
    defaultContent: {
      eyebrow: 'Manifeste',
      title: 'Nous croyons aux soins qui laissent une memoire, pas seulement une promesse.',
      paragraph1: "Pour nous, un produit d'exception n'est pas simplement une somme d'actifs. C'est une experience parfaitement composee.",
      paragraph2: "C'est pour cela que Somacan travaille autant la formulation que l'atmosphere. Nous ne separons pas le fond et la forme.",
      paragraph3: "Cette coherence est notre exigence principale. Elle nous permet de construire une marque plus dense, plus calme et plus reconnaissable.",
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Titre', type: 'textarea' },
      { name: 'paragraph1', label: 'Paragraphe 1', type: 'textarea' },
      { name: 'paragraph2', label: 'Paragraphe 2', type: 'textarea' },
      { name: 'paragraph3', label: 'Paragraphe 3', type: 'textarea' },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  AboutMethod: {
    type: 'AboutMethod',
    label: 'About — Methode',
    icon: 'flask',
    defaultContent: {
      eyebrow: 'Methode',
      title: 'Traduire l\'heritage en gestes contemporains.',
      description1: "Somacan puise dans un imaginaire marocain reel: les matieres vegetales, l'importance du toucher, le lien entre soin et hospitalite.",
      description2: "Mais nous refusons de figer cet heritage dans une image folklorique. Nous le faisons passer par une ecriture plus nette, plus minimaliste, plus actuelle.",
      quoteText: "Chaque formule doit pouvoir vivre dans une vraie routine: facile a adopter, belle a appliquer, suffisamment singuliere pour etre memorisee.",
      methodImage: '/asset/Soins de bien-être élégants et naturels.png',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'description1', label: 'Paragraphe 1', type: 'textarea' },
      { name: 'description2', label: 'Paragraphe 2', type: 'textarea' },
      { name: 'quoteText', label: 'Citation', type: 'textarea' },
      { name: 'methodImage', label: 'Image', type: 'image' },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  AboutTimeline: {
    type: 'AboutTimeline',
    label: 'About — Timeline (dark)',
    icon: 'zap',
    defaultContent: {
      eyebrow: 'Construction',
      sectionTitle: 'Comment une intuition devient une marque.',
      description: "Somacan s'est construit par reduction, pas par accumulation. Il a fallu observer, retirer, recomposer puis clarifier jusqu'a trouver une forme juste.",
      steps: [
        { step: '01', title: 'Observer les rituels', text: "Comprendre les gestes transmis, les matieres qui apaisent et les formes de soin qui appartiennent deja a la culture marocaine." },
        { step: '02', title: "Retenir l'essentiel", text: "Faire le tri. Garder la noblesse, la sensualite, la coherence. Retirer le decoratif et tout ce qui surcharge inutilement l'experience." },
        { step: '03', title: 'Composer une marque', text: "Transformer cette matiere en une ecriture complete: formules, images, mots, rythme de routine et sensation d'ensemble." },
      ],
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'sectionTitle', label: 'Titre', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'steps',
        label: 'Étapes',
        type: 'repeater',
        fields: [
          { name: 'step', label: 'Numéro', type: 'text' },
          { name: 'title', label: 'Titre', type: 'text' },
          { name: 'text', label: 'Texte', type: 'textarea' },
        ],
      },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  AboutEngagement: {
    type: 'AboutEngagement',
    label: 'About — Engagement',
    icon: 'check',
    defaultContent: {
      eyebrow: 'Engagement',
      title: 'Une marque qui prefere la coherence a la surenchere.',
      commitments: [
        "Des soins penses comme des objets d'usage quotidien, pas comme des promesses abstraites.",
        "Une marque qui relie le visuel, le toucher et le langage au lieu de les traiter separement.",
        "Une attention particuliere aux textures, parce que l'experience commence avant tout resultat visible.",
        "Un univers calme, premium et marocain sans folklore excessif ni imitation des codes globaux les plus vus.",
      ],
      ctaPrimaryText: 'Voir les soins',
      ctaPrimaryHref: '/shop',
      ctaSecondaryText: 'Ouvrir le Journal',
      ctaSecondaryHref: '/blog',
      engagementImage: '/asset/ChatGPT Image 14 avr. 2026, 14_25_00.png',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'commitments', label: 'Engagements', type: 'repeater', fields: [{ name: 'text', label: 'Texte', type: 'textarea' }] },
      { name: 'ctaPrimaryText', label: 'CTA principal', type: 'text' },
      { name: 'ctaPrimaryHref', label: 'CTA principal lien', type: 'text' },
      { name: 'ctaSecondaryText', label: 'CTA secondaire', type: 'text' },
      { name: 'ctaSecondaryHref', label: 'CTA secondaire lien', type: 'text' },
      { name: 'engagementImage', label: 'Image', type: 'image' },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  // ── Blog ────────────────────────────────────────────────────────────────────

  BlogHero: {
    type: 'BlogHero',
    label: 'Blog — Hero header',
    icon: 'moon',
    defaultContent: {
      eyebrow: 'Journal Somacan',
      title: 'Archives &',
      titleItalic: 'rituels éditoriaux.',
      description: "Science botanique, gestes de beauté et inspirations marocaines réunis dans un journal pensé comme une extension du soin.",
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Titre ligne 1', type: 'text' },
      { name: 'titleItalic', label: 'Titre ligne 2 (italique)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  BlogGrid: {
    type: 'BlogGrid',
    label: 'Blog — Grille articles',
    icon: 'moon',
    defaultContent: {},
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  // ── Article + Product detail surrounding sections ────────────────────────────

  ArticleEditorialNote: {
    type: 'ArticleEditorialNote',
    label: 'Article — Note éditoriale',
    icon: 'story',
    defaultContent: {
      eyebrow: 'Note éditoriale',
      description: "Chaque article du Journal Somacan prolonge l'univers de la marque: botanique marocaine, précision cosmétique et rituels contemporains.",
      ctaText: 'Découvrir Notre Histoire',
      ctaHref: '/about',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Label', type: 'text' },
      { name: 'description', label: 'Texte', type: 'textarea' },
      { name: 'ctaText', label: 'CTA texte', type: 'text' },
      { name: 'ctaHref', label: 'CTA lien', type: 'text' },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  ProductRelated: {
    type: 'ProductRelated',
    label: 'Produits — Vous aimerez aussi',
    icon: 'star',
    defaultContent: {
      eyebrow: 'Dans le même univers',
      title: 'Vous aimerez aussi.',
      maxItems: 4,
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'maxItems', label: 'Nombre max produits', type: 'text' },
    ],
    settingsFields: [{ name: 'backgroundColor', label: 'Couleur de fond', type: 'color' }],
  },

  ContactHero: {
    type: 'ContactHero',
    label: 'Contact — Hero',
    icon: 'globe',
    defaultContent: {
      eyebrow: 'Contact',
      title: 'Une conversation',
      titleItalic: 'calme et precise.',
      description: "Que vous ayez une question sur une routine, un besoin de recommandation, un suivi de commande ou une demande de collaboration, nous vous repondons avec le meme niveau d'attention que nos soins.",
      ctaPrimaryText: 'Ecrire maintenant',
      ctaPrimaryHref: '#contact-form',
      ctaSecondaryText: 'Voir la localisation',
      ctaSecondaryHref: '#map',
      heroImage: '',
      overlayTitle: 'Une equipe attentive,',
      overlaySubtitle: 'sans script automatique.',
      overlayBadge: 'Reponse rapide',
      cards: [
        { icon: 'Phone', label: 'Telephone', value: '+212 5XX-XXXXXX', detail: 'Lundi au samedi, 9h00 a 19h00', href: 'tel:+212500000000' },
        { icon: 'Mail', label: 'Email', value: 'contact@somacan.ma', detail: 'Reponse moyenne en moins de 24h', href: 'mailto:contact@somacan.ma' },
        { icon: 'MapPin', label: 'Showroom', value: 'Casablanca, Maroc', detail: 'Rendez-vous prive sur demande', href: '#map' },
      ],
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Label eyebrow', type: 'text' },
      { name: 'title', label: 'Titre ligne 1', type: 'text' },
      { name: 'titleItalic', label: 'Titre ligne 2 (italique)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'ctaPrimaryText', label: 'CTA principal texte', type: 'text' },
      { name: 'ctaSecondaryText', label: 'CTA secondaire texte', type: 'text' },
      { name: 'heroImage', label: 'Image hero', type: 'image' },
      { name: 'overlayTitle', label: 'Overlay — titre', type: 'text' },
      { name: 'overlaySubtitle', label: 'Overlay — sous-titre', type: 'text' },
      { name: 'overlayBadge', label: 'Overlay — badge', type: 'text' },
      {
        name: 'cards',
        label: 'Cartes de contact',
        type: 'repeater',
        fields: [
          { name: 'icon', label: 'Icône (Phone / Mail / MapPin)', type: 'text' },
          { name: 'label', label: 'Label', type: 'text' },
          { name: 'value', label: 'Valeur', type: 'text' },
          { name: 'detail', label: 'Détail', type: 'text' },
          { name: 'href', label: 'Lien href', type: 'text' },
        ],
      },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  ContactForm: {
    type: 'ContactForm',
    label: 'Contact — Formulaire',
    icon: 'flask',
    defaultContent: {
      sidebarTitle: 'Parlons du bon sujet, au bon moment.',
      sidebarEyebrow: 'Quand nous contacter',
      serviceMoments: [
        'Conseils produits et routines personnalisees',
        'Suivi de commande et informations livraison',
        'Demandes presse, collaborations et wholesale',
      ],
      hoursLabel: 'Lundi au samedi, 9h00 a 19h00',
      socialEyebrow: 'Restez proches',
      formEyebrow: 'Formulaire',
      formTitle: 'Envoyez-nous',
      formTitleLine2: 'votre message.',
      formBadge: 'Reponse humaine',
      idleNote: 'Nous lisons chaque message avec attention et sans reponse automatique impersonnelle.',
      submitLabel: 'Envoyer le message',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'sidebarEyebrow', label: 'Sidebar — eyebrow', type: 'text' },
      { name: 'sidebarTitle', label: 'Sidebar — titre', type: 'text' },
      { name: 'hoursLabel', label: 'Horaires', type: 'text' },
      { name: 'socialEyebrow', label: 'Social — label', type: 'text' },
      { name: 'formEyebrow', label: 'Formulaire — eyebrow', type: 'text' },
      { name: 'formTitle', label: 'Formulaire — titre ligne 1', type: 'text' },
      { name: 'formTitleLine2', label: 'Formulaire — titre ligne 2', type: 'text' },
      { name: 'formBadge', label: 'Badge label', type: 'text' },
      { name: 'submitLabel', label: 'Texte bouton envoi', type: 'text' },
      { name: 'idleNote', label: 'Note par défaut', type: 'text' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  ContactMap: {
    type: 'ContactMap',
    label: 'Contact — Carte',
    icon: 'globe',
    defaultContent: {
      eyebrow: 'Localisation',
      title: 'Retrouvez',
      titleItalic: 'Somacan a Casablanca.',
      description: "Notre univers est pense comme une experience plus qu'un simple point de contact. Utilisez la carte pour nous situer et organiser un echange, une visite ou un retrait selon votre besoin.",
      mapSrc: 'https://www.google.com/maps?q=Casablanca%2C%20Morocco&z=12&output=embed',
      mapTitle: 'Somacan Casablanca map',
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Label eyebrow', type: 'text' },
      { name: 'title', label: 'Titre ligne 1', type: 'text' },
      { name: 'titleItalic', label: 'Titre ligne 2 (italique)', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'mapSrc', label: 'Google Maps embed URL', type: 'text' },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
  },

  ContactFAQ: {
    type: 'ContactFAQ',
    label: 'Contact — FAQ',
    icon: 'shield',
    defaultContent: {
      eyebrow: 'Questions frequentes',
      title: 'Avant de nous ecrire.',
      subtitle: "Quelques clarifications utiles pour garder l'echange fluide et rapide.",
      faqs: [
        { title: 'Je ne sais pas quel produit choisir.', text: "Dites-nous votre besoin, votre type de peau et votre routine actuelle. Nous vous orienterons vers une selection claire, sans surcharge." },
        { title: 'Puis-je prendre rendez-vous ?', text: "Oui. Pour les demandes premium, presse ou partenariats, nous pouvons organiser un echange prive en visio ou a Casablanca." },
        { title: 'Le formulaire envoie-t-il un vrai message ?', text: "Le formulaire est connecte a notre backend. Il valide les champs, enregistre la soumission et affiche une confirmation. Chaque message est lu par notre equipe." },
      ],
    },
    defaultSettings: { backgroundColor: '#fcfaf7' },
    defaultAnimation: { type: 'none' },
    fields: [
      { name: 'eyebrow', label: 'Label eyebrow', type: 'text' },
      { name: 'title', label: 'Titre', type: 'text' },
      { name: 'subtitle', label: 'Sous-titre', type: 'text' },
      {
        name: 'faqs',
        label: 'Questions / Réponses',
        type: 'repeater',
        fields: [
          { name: 'title', label: 'Question', type: 'text' },
          { name: 'text', label: 'Réponse', type: 'textarea' },
        ],
      },
    ],
    settingsFields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
    ],
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
