import { useState, useEffect } from 'react';
import { getFooterSettings } from '../lib/api';

const logoWhite = new URL('../public/asset/Logo somacan White.png', import.meta.url).href;

export const FOOTER_DEFAULTS = {
  logo: { src: '', alt: 'Somacan', width: 208 },
  description: "Pionnier du cannabis légal au Maroc. Nous combinons le meilleur de la nature et du CBD pour offrir des solutions de soin naturel d'exception.",
  columns: [
    { title: 'Liens rapides', links: [
      { label: 'Boutique', href: '/shop' },
      { label: 'Notre histoire', href: '/about' },
      { label: 'Journal', href: '/blog' },
      { label: 'Accueil', href: '/' },
    ]},
  ],
  socials: [
    { platform: 'Instagram', href: '#', icon: 'I' },
    { platform: 'Facebook', href: '#', icon: 'F' },
    { platform: 'TikTok', href: '#', icon: 'T' },
  ],
  newsletter: { enabled: false, title: 'Newsletter', placeholder: 'Votre email', buttonText: "S'abonner" },
  legal: {
    copyright: '© 2026 Somacan. Tous droits réservés.',
    links: [
      { label: 'Politique de confidentialité', href: '#' },
      { label: 'Conditions générales', href: '#' },
    ],
  },
  contact: { email: 'contact@somacan.ma', phone: '+212 5XX-XXXXXX', address: 'Casablanca, Maroc' },
  theme: {
    backgroundColor: '#1c1917',
    textColor: '#d6d3d1',
    headingColor: '#ffffff',
    accentColor: '#d49a2e',
    borderColor: 'rgba(255,255,255,0.10)',
  },
};

function parseJsonField(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeArray(value, fallback) {
  const parsed = parseJsonField(value, fallback);
  return Array.isArray(parsed) ? parsed : fallback;
}

function normalizeObject(value, fallback) {
  const parsed = parseJsonField(value, fallback);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
}

export default function useFooterSettings() {
  const [footer, setFooter] = useState(FOOTER_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFooterSettings()
      .then(data => {
        const logo = normalizeObject(data.logo, FOOTER_DEFAULTS.logo);
        const columns = normalizeArray(data.columns, FOOTER_DEFAULTS.columns);
        const socials = normalizeArray(data.socials, FOOTER_DEFAULTS.socials);
        const newsletter = normalizeObject(data.newsletter, FOOTER_DEFAULTS.newsletter);
        const legal = normalizeObject(data.legal, FOOTER_DEFAULTS.legal);
        const contact = normalizeObject(data.contact, FOOTER_DEFAULTS.contact);
        const theme = normalizeObject(data.theme, FOOTER_DEFAULTS.theme);

        setFooter({
          logo: { ...FOOTER_DEFAULTS.logo, ...logo },
          description: data.description || FOOTER_DEFAULTS.description,
          columns: columns.length > 0 ? columns : FOOTER_DEFAULTS.columns,
          socials: socials.length > 0 ? socials : FOOTER_DEFAULTS.socials,
          newsletter: { ...FOOTER_DEFAULTS.newsletter, ...newsletter },
          legal: {
            copyright: legal.copyright || FOOTER_DEFAULTS.legal.copyright,
            links: Array.isArray(legal.links) && legal.links.length > 0 ? legal.links : FOOTER_DEFAULTS.legal.links,
          },
          contact: { ...FOOTER_DEFAULTS.contact, ...contact },
          theme: { ...FOOTER_DEFAULTS.theme, ...theme },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { footer, loading };
}
