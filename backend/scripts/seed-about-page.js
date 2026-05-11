import sequelize from '../config/database.js';
import { Page, PageSection } from '../models/index.js';

async function seed() {
  await sequelize.sync();

  const [page] = await Page.findOrCreate({
    where: { slug: 'about' },
    defaults: {
      title: 'Somacan - Notre Histoire',
      template: 'about',
      isPublished: true,
    },
  });

  await PageSection.destroy({ where: { pageSlug: 'about' } });

  const sections = [
    {
      pageId: page.id,
      pageSlug: 'about',
      name: 'About Hero',
      type: 'AboutHero',
      order: 10,
      isActive: true,
      content: {
        eyebrow: 'Notre Histoire',
        title: 'Un soin ne nait pas',
        titleItalic: "d'une tendance.",
        description1: "Somacan est ne d'une conviction simple: la beaute peut etre a la fois precise, sensorielle et profonde. Nous voulions une marque capable de parler du Maroc sans caricature, du soin sans agitation, et du luxe sans demonstration forcee.",
        description2: "L'ambition n'etait pas de produire une ligne cosmetique de plus, mais de construire un langage complet autour du rituel: la matiere, le geste, l'image, le silence, la duree.",
        ctaPrimaryText: 'Explorer la boutique',
        ctaPrimaryHref: '/shop',
        ctaSecondaryText: 'Lire le Journal',
        ctaSecondaryHref: '/blog',
        stat1Value: '3',
        stat1Label: 'piliers',
        stat2Value: '1',
        stat2Label: 'vision claire',
        stat3Value: '∞',
        stat3Label: 'gestes possibles',
        heroImage: '/asset/ChatGPT Image 29 avr. 2026, 15_06_48 (3).png',
        badgeLabel: 'Signature',
        badgeText: 'Calme. Matiere. Precision.',
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'about',
      name: 'About Principles',
      type: 'AboutPrinciples',
      order: 20,
      isActive: true,
      content: {
        principles: [
          {
            icon: 'Leaf',
            title: 'Botanique situee',
            text: "Nous partons d'un territoire, d'un rythme et d'un geste avant de parler de produit. La matiere n'est jamais deconnectee de son univers.",
          },
          {
            icon: 'FlaskConical',
            title: 'Formules lisibles',
            text: "Somacan cherche des textures claires, sensorielles et immediates. Le luxe, ici, ne vient pas de l'exces mais de la precision.",
          },
          {
            icon: 'Sparkles',
            title: 'Rituel contemporain',
            text: "Chaque soin doit pouvoir entrer dans une vraie vie, avec une sensation juste, une application simple et une memoire durable.",
          },
        ],
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'about',
      name: 'About Manifeste',
      type: 'AboutManifeste',
      order: 30,
      isActive: true,
      content: {
        eyebrow: 'Manifeste',
        title: 'Nous croyons aux soins qui laissent une memoire, pas seulement une promesse.',
        paragraph1: "Pour nous, un produit d'exception n'est pas simplement une somme d'actifs. C'est une experience parfaitement composee. La facon dont il entre dans la routine. Le silence qu'il installe. Le type de relation qu'il cree avec la peau et avec le temps.",
        paragraph2: "C'est pour cela que Somacan travaille autant la formulation que l'atmosphere. Nous ne separons pas le fond et la forme. La beaute du flacon, la justesse des mots, la sensualite de la texture et la lisibilite du geste doivent raconter la meme chose.",
        paragraph3: "Cette coherence est notre exigence principale. Elle nous permet de construire une marque plus dense, plus calme et plus reconnaissable.",
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'about',
      name: 'About Method',
      type: 'AboutMethod',
      order: 40,
      isActive: true,
      content: {
        eyebrow: 'Methode',
        title: 'Traduire l\'heritage en gestes contemporains.',
        description1: "Somacan puise dans un imaginaire marocain reel: les matieres vegetales, l'importance du toucher, le lien entre soin et hospitalite, la sensualite discrete des textures et des parfums.",
        description2: "Mais nous refusons de figer cet heritage dans une image folklorique. Nous le faisons passer par une ecriture plus nette, plus minimaliste, plus actuelle. Ce n'est pas une nostalgie. C'est une traduction.",
        quoteText: "Chaque formule doit pouvoir vivre dans une vraie routine: facile a adopter, belle a appliquer, suffisamment singuliere pour etre memorisee.",
        methodImage: '/asset/soins-bien-etre.png',
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'about',
      name: 'About Timeline',
      type: 'AboutTimeline',
      order: 50,
      isActive: true,
      content: {
        eyebrow: 'Construction',
        sectionTitle: 'Comment une intuition devient une marque.',
        description: "Somacan s'est construit par reduction, pas par accumulation. Il a fallu observer, retirer, recomposer puis clarifier jusqu'a trouver une forme juste.",
        steps: [
          {
            step: '01',
            title: 'Observer les rituels',
            text: "Comprendre les gestes transmis, les matieres qui apaisent et les formes de soin qui appartiennent deja a la culture marocaine.",
          },
          {
            step: '02',
            title: "Retenir l'essentiel",
            text: "Faire le tri. Garder la noblesse, la sensualite, la coherence. Retirer le decoratif et tout ce qui surcharge inutilement l'experience.",
          },
          {
            step: '03',
            title: 'Composer une marque',
            text: "Transformer cette matiere en une ecriture complete: formules, images, mots, rythme de routine et sensation d'ensemble.",
          },
        ],
      },
      settings: {},
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'about',
      name: 'About Engagement',
      type: 'AboutEngagement',
      order: 60,
      isActive: true,
      content: {
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
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
  ];

  for (const s of sections) {
    await PageSection.create(s);
  }

  console.log('About page seeded with 6 sections: AboutHero, AboutPrinciples, AboutManifeste, AboutMethod, AboutTimeline, AboutEngagement');
  process.exit();
}

seed();
