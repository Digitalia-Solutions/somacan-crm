import { useEffect } from 'react';
import { getThemeSettings } from '../lib/api';

export function applyThemeToCssVars(theme) {
  const root = document.documentElement;
  if (!theme) return;
  root.style.setProperty('--color-primary',    theme.primaryColor    || '#033a22');
  root.style.setProperty('--color-secondary',  theme.secondaryColor  || '#1c1917');
  root.style.setProperty('--color-accent',     theme.accentColor     || '#d49a2e');
  root.style.setProperty('--color-bg',         theme.backgroundColor || '#fcfaf7');
  root.style.setProperty('--color-text',       theme.textColor       || '#1c1917');
  root.style.setProperty('--font-heading',     theme.headingFont     || 'Aariana, serif');
  root.style.setProperty('--font-body',        theme.bodyFont        || 'Manrope, sans-serif');
  root.style.setProperty('--border-radius',    theme.borderRadius    || '1rem');
  root.style.setProperty('--container-width',  theme.containerWidth  || '1400px');
  root.style.setProperty('--section-padding',  theme.sectionPadding  || '6rem 2.5rem');
}

export default function useTheme() {
  useEffect(() => {
    getThemeSettings()
      .then(applyThemeToCssVars)
      .catch(() => {}); // silently fail — defaults apply
  }, []);
}
