import { useState, useEffect } from 'react';
import { getHeaderSettings, getMenu } from '../lib/api';

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

function menuItemsToNavLinks(items = []) {
  return items.map(item => ({
    label: item.label,
    href: item.url,
    isExternal: item.type === 'external',
    target: item.target || '_self',
    ...(item.children?.length > 0 && { children: menuItemsToNavLinks(item.children) }),
  }));
}

export default function useHeaderSettings() {
  const [header, setHeader] = useState(HEADER_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getHeaderSettings().catch(() => null),
      getMenu('main').catch(() => null),
    ]).then(([headerData, menuData]) => {
      const base = headerData || {};
      // Build navLinks: prefer CMS menu, fallback to header navLinks, fallback to defaults
      let navLinks = HEADER_DEFAULTS.navLinks;
      if (menuData?.items?.length > 0) {
        navLinks = menuItemsToNavLinks(menuData.items);
      } else if (base.navLinks?.length > 0) {
        navLinks = base.navLinks;
      }
      setHeader({
        logo: { ...HEADER_DEFAULTS.logo, ...(base.logo || {}) },
        navLinks,
        ctaButton: { ...HEADER_DEFAULTS.ctaButton, ...(base.ctaButton || {}) },
        settings: { ...HEADER_DEFAULTS.settings, ...(base.settings || {}) },
        theme: { ...HEADER_DEFAULTS.theme, ...(base.theme || {}) },
      });
    }).finally(() => setLoading(false));
  }, []);

  return { header, loading };
}
