import { useState, useEffect } from 'react';
import { getHeaderSettings } from '../lib/api';

const logoDark = new URL('../public/asset/cropped-LOGO_SOMACAN_SHOP__1_-removebg-preview.webp', import.meta.url).href;

export const HEADER_DEFAULTS = {
  logo: { src: logoDark, alt: 'Somacan', width: 180 },
  navLinks: [
    { label: 'Accueil', href: '/', isExternal: false },
    { label: 'Boutique', href: '/shop', isExternal: false },
    { label: 'Notre Histoire', href: '/about', isExternal: false },
    { label: 'Journal', href: '/blog', isExternal: false },
    { label: 'Contact', href: '/contact', isExternal: false },
  ],
  ctaButton: { label: '', href: '', variant: 'primary' },
  settings: {
    sticky: true,
    transparent: false,
    transparentScrollThreshold: 50,
    hideOnHomeTop: true,
  },
  theme: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    stickyBackgroundColor: 'rgba(255,255,255,0.90)',
    textColor: '#043920B3',
    stickyTextColor: '#043920',
    activeColor: '#043920',
    iconColor: '#043920',
    stickyIconColor: '#043920',
    mobileBackgroundColor: '#ffffff',
    backdropBlur: '12px',
    shadowColor: 'rgba(28,25,23,0.08)',
  },
};

export default function useHeaderSettings() {
  const [header, setHeader] = useState(HEADER_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHeaderSettings()
      .then(data => {
        setHeader({
          logo: { ...HEADER_DEFAULTS.logo, ...(data.logo || {}) },
          navLinks: (data.navLinks && data.navLinks.length > 0) ? data.navLinks : HEADER_DEFAULTS.navLinks,
          ctaButton: { ...HEADER_DEFAULTS.ctaButton, ...(data.ctaButton || {}) },
          settings: { ...HEADER_DEFAULTS.settings, ...(data.settings || {}) },
          theme: { ...HEADER_DEFAULTS.theme, ...(data.theme || {}) },
        });
      })
      .catch(() => {}) // keep defaults on error
      .finally(() => setLoading(false));
  }, []);

  return { header, loading };
}
