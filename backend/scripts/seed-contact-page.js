import sequelize from '../config/database.js';
import { Page, PageSection } from '../models/index.js';

async function seed() {
  await sequelize.sync();

  const [page] = await Page.findOrCreate({
    where: { slug: 'contact' },
    defaults: {
      title: 'Somacan - Contact',
      template: 'contact',
      isPublished: true,
    },
  });

  // Remove existing sections to avoid duplication on re-seed
  await PageSection.destroy({ where: { pageSlug: 'contact' } });

  const sections = [
    {
      pageId: page.id,
      pageSlug: 'contact',
      name: 'Contact Hero',
      type: 'ContactHero',
      order: 10,
      isActive: true,
      content: {
        eyebrow: 'Contact',
        title: 'Une conversation',
        titleItalic: 'calme et precise.',
        description:
          "Que vous ayez une question sur une routine, un besoin de recommandation, un suivi de commande ou une demande de collaboration, nous vous repondons avec le meme niveau d'attention que nos soins.",
        ctaPrimaryText: 'Ecrire maintenant',
        ctaPrimaryHref: '#contact-form',
        ctaSecondaryText: 'Voir la localisation',
        ctaSecondaryHref: '#map',
        heroImage: '/asset/soins-bien-etre.png',
        overlayTitle: 'Une equipe attentive,',
        overlaySubtitle: 'sans script automatique.',
        overlayBadge: 'Reponse rapide',
        cards: [
          { icon: 'Phone', label: 'Telephone', value: '+212 5XX-XXXXXX', detail: 'Lundi au samedi, 9h00 a 19h00', href: 'tel:+212500000000' },
          { icon: 'Mail', label: 'Email', value: 'contact@somacan.ma', detail: 'Reponse moyenne en moins de 24h', href: 'mailto:contact@somacan.ma' },
          { icon: 'MapPin', label: 'Showroom', value: 'Casablanca, Maroc', detail: 'Rendez-vous prive sur demande', href: '#map' },
        ],
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'contact',
      name: 'Contact Form',
      type: 'ContactForm',
      order: 20,
      isActive: true,
      content: {
        sidebarEyebrow: 'Quand nous contacter',
        sidebarTitle: 'Parlons du bon sujet, au bon moment.',
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
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'contact',
      name: 'Contact Map',
      type: 'ContactMap',
      order: 30,
      isActive: true,
      content: {
        eyebrow: 'Localisation',
        title: 'Retrouvez',
        titleItalic: 'Somacan a Casablanca.',
        description:
          "Notre univers est pense comme une experience plus qu'un simple point de contact. Utilisez la carte pour nous situer et organiser un echange, une visite ou un retrait selon votre besoin.",
        mapSrc: 'https://www.google.com/maps?q=Casablanca%2C%20Morocco&z=12&output=embed',
        mapTitle: 'Somacan Casablanca map',
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
    {
      pageId: page.id,
      pageSlug: 'contact',
      name: 'Contact FAQ',
      type: 'ContactFAQ',
      order: 40,
      isActive: true,
      content: {
        eyebrow: 'Questions frequentes',
        title: 'Avant de nous ecrire.',
        subtitle: "Quelques clarifications utiles pour garder l'echange fluide et rapide.",
        faqs: [
          {
            title: 'Je ne sais pas quel produit choisir.',
            text: "Dites-nous votre besoin, votre type de peau et votre routine actuelle. Nous vous orienterons vers une selection claire, sans surcharge.",
          },
          {
            title: 'Puis-je prendre rendez-vous ?',
            text: "Oui. Pour les demandes premium, presse ou partenariats, nous pouvons organiser un echange prive en visio ou a Casablanca.",
          },
          {
            title: 'Le formulaire envoie-t-il un vrai message ?',
            text: "Le formulaire est connecte a notre backend. Il valide les champs, enregistre la soumission et affiche une confirmation. Chaque message est lu par notre equipe.",
          },
        ],
      },
      settings: { backgroundColor: '#fcfaf7' },
      animation: { type: 'none' },
    },
  ];

  for (const s of sections) {
    await PageSection.create(s);
  }

  console.log('Contact page seeded with 4 sections: ContactHero, ContactForm, ContactMap, ContactFAQ');
  process.exit();
}

seed();
