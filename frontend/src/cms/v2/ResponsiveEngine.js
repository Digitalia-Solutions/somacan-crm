import { createResponsiveValue, CMS_DEVICES, DEFAULT_DEVICE_RESPONSIVE } from '../../../../shared/cms/responsive.js';

const DEVICE_QUERIES = {
  desktop: '@media (min-width: 1025px)',
  tablet: '@media (max-width: 1024px)',
  mobile: '@media (max-width: 767px)',
};

const DEVICE_BREAKPOINTS = {
  desktop: 1025,
  tablet: 1024,
  mobile: 767,
};

export function normalizeResponsiveConfig(value) {
  return createResponsiveValue(value || {});
}

/**
 * Check if a widget/section is visible on a given device.
 * @param {Object} responsive
 * @param {string} device — 'desktop' | 'tablet' | 'mobile'
 * @returns {boolean}
 */
export function isDeviceVisible(responsive, device) {
  const normalized = normalizeResponsiveConfig(responsive);
  return normalized[device]?.visible !== false;
}

/**
 * Get the CSS media query string for a device.
 * @param {string} device
 * @returns {string}
 */
export function getMediaQuery(device) {
  return DEVICE_QUERIES[device] || '';
}

/**
 * Get the breakpoint pixel value for a device.
 * @param {string} device
 * @returns {number}
 */
export function getDeviceBreakpoint(device) {
  return DEVICE_BREAKPOINTS[device] || 0;
}

export function getVisibilityClasses(responsive) {
  const normalized = normalizeResponsiveConfig(responsive);
  const classes = [];

  if (normalized.desktop.visible === false) {
    classes.push('lg:hidden');
  }
  if (normalized.tablet.visible === false) {
    classes.push('md:hidden lg:block');
  }
  if (normalized.mobile.visible === false) {
    classes.push('hidden md:block');
  }

  return classes.join(' ');
}

export function buildResponsiveStyleVariables(responsive, prefix = '--cms') {
  const normalized = normalizeResponsiveConfig(responsive);
  const style = {};
  const assign = (key, value) => {
    if (value && value !== 'inherit' && value !== 'auto') {
      style[key] = value;
    }
  };

  assign(`${prefix}-desktop-padding`, normalized.desktop.padding);
  assign(`${prefix}-tablet-padding`, normalized.tablet.padding);
  assign(`${prefix}-mobile-padding`, normalized.mobile.padding);
  assign(`${prefix}-desktop-margin`, normalized.desktop.margin);
  assign(`${prefix}-tablet-margin`, normalized.tablet.margin);
  assign(`${prefix}-mobile-margin`, normalized.mobile.margin);
  assign(`${prefix}-desktop-width`, normalized.desktop.width);
  assign(`${prefix}-tablet-width`, normalized.tablet.width);
  assign(`${prefix}-mobile-width`, normalized.mobile.width);
  assign(`${prefix}-desktop-font-size`, normalized.desktop.typography.fontSize);
  assign(`${prefix}-tablet-font-size`, normalized.tablet.typography.fontSize);
  assign(`${prefix}-mobile-font-size`, normalized.mobile.typography.fontSize);
  assign(`${prefix}-desktop-line-height`, normalized.desktop.typography.lineHeight);
  assign(`${prefix}-tablet-line-height`, normalized.tablet.typography.lineHeight);
  assign(`${prefix}-mobile-line-height`, normalized.mobile.typography.lineHeight);
  assign(`${prefix}-desktop-letter-spacing`, normalized.desktop.typography.letterSpacing);
  assign(`${prefix}-tablet-letter-spacing`, normalized.tablet.typography.letterSpacing);
  assign(`${prefix}-mobile-letter-spacing`, normalized.mobile.typography.letterSpacing);
  assign(`${prefix}-desktop-align`, normalized.desktop.alignment);
  assign(`${prefix}-tablet-align`, normalized.tablet.alignment);
  assign(`${prefix}-mobile-align`, normalized.mobile.alignment);

  return style;
}

export function getResponsiveInlineStyle(responsive) {
  const normalized = normalizeResponsiveConfig(responsive);
  return {
    padding: normalized.desktop.padding || undefined,
    margin: normalized.desktop.margin || undefined,
    width: normalized.desktop.width !== 'auto' ? normalized.desktop.width : undefined,
    textAlign: normalized.desktop.alignment !== 'inherit' ? normalized.desktop.alignment : undefined,
    fontSize: normalized.desktop.typography.fontSize || undefined,
    lineHeight: normalized.desktop.typography.lineHeight || undefined,
    letterSpacing: normalized.desktop.typography.letterSpacing || undefined,
  };
}

/**
 * Build a complete responsive stylesheet with CSS custom properties
 * and media-query fallbacks for a given className.
 */
export function buildResponsiveStylesheet(className, responsive, prefix = '--cms') {
  const normalized = normalizeResponsiveConfig(responsive);

  return `
.${className} {
  padding: var(${prefix}-desktop-padding, ${normalized.desktop.padding || 'initial'});
  margin: var(${prefix}-desktop-margin, ${normalized.desktop.margin || 'initial'});
  width: var(${prefix}-desktop-width, ${normalized.desktop.width || 'auto'});
  text-align: var(${prefix}-desktop-align, ${normalized.desktop.alignment || 'inherit'});
  font-size: var(${prefix}-desktop-font-size, inherit);
  line-height: var(${prefix}-desktop-line-height, inherit);
  letter-spacing: var(${prefix}-desktop-letter-spacing, inherit);
}
${DEVICE_QUERIES.tablet} {
  .${className} {
    padding: var(${prefix}-tablet-padding, var(${prefix}-desktop-padding, ${normalized.desktop.padding || 'initial'}));
    margin: var(${prefix}-tablet-margin, var(${prefix}-desktop-margin, ${normalized.desktop.margin || 'initial'}));
    width: var(${prefix}-tablet-width, var(${prefix}-desktop-width, ${normalized.desktop.width || 'auto'}));
    text-align: var(${prefix}-tablet-align, var(${prefix}-desktop-align, ${normalized.desktop.alignment || 'inherit'}));
    font-size: var(${prefix}-tablet-font-size, var(${prefix}-desktop-font-size, inherit));
    line-height: var(${prefix}-tablet-line-height, var(${prefix}-desktop-line-height, inherit));
    letter-spacing: var(${prefix}-tablet-letter-spacing, var(${prefix}-desktop-letter-spacing, inherit));
  }
}
${DEVICE_QUERIES.mobile} {
  .${className} {
    padding: var(${prefix}-mobile-padding, var(${prefix}-tablet-padding, var(${prefix}-desktop-padding, ${normalized.desktop.padding || 'initial'})));
    margin: var(${prefix}-mobile-margin, var(${prefix}-tablet-margin, var(${prefix}-desktop-margin, ${normalized.desktop.margin || 'initial'})));
    width: var(${prefix}-mobile-width, var(${prefix}-tablet-width, var(${prefix}-desktop-width, ${normalized.desktop.width || 'auto'})));
    text-align: var(${prefix}-mobile-align, var(${prefix}-tablet-align, var(${prefix}-desktop-align, ${normalized.desktop.alignment || 'inherit'})));
    font-size: var(${prefix}-mobile-font-size, var(${prefix}-tablet-font-size, var(${prefix}-desktop-font-size, inherit)));
    line-height: var(${prefix}-mobile-line-height, var(${prefix}-tablet-line-height, var(${prefix}-desktop-line-height, inherit)));
    letter-spacing: var(${prefix}-mobile-letter-spacing, var(${prefix}-tablet-letter-spacing, var(${prefix}-desktop-letter-spacing, inherit)));
  }
}
`.trim();
}

/**
 * Build responsive CSS for grid columns.
 * @param {string} className
 * @param {Object} responsive
 * @param {number} desktopColumns
 * @param {number} tabletColumns
 * @param {number} mobileColumns
 */
export function buildResponsiveGridStylesheet(
  className,
  responsive,
  desktopColumns = 3,
  tabletColumns = 2,
  mobileColumns = 1
) {
  const normalized = normalizeResponsiveConfig(responsive);
  const dc = normalized.desktop.columns || desktopColumns;
  const tc = normalized.tablet.columns || tabletColumns;
  const mc = normalized.mobile.columns || mobileColumns;

  return `
.${className} {
  display: grid;
  grid-template-columns: repeat(${dc}, minmax(0, 1fr));
}
${DEVICE_QUERIES.tablet} {
  .${className} {
    grid-template-columns: repeat(${tc}, minmax(0, 1fr));
  }
}
${DEVICE_QUERIES.mobile} {
  .${className} {
    grid-template-columns: repeat(${mc}, minmax(0, 1fr));
  }
}
`.trim();
}

/**
 * Build responsive flex alignment stylesheet.
 */
export function buildResponsiveFlexStylesheet(className, responsive) {
  const normalized = normalizeResponsiveConfig(responsive);
  const da = normalized.desktop.alignment || 'inherit';
  const ta = normalized.tablet.alignment || da;
  const ma = normalized.mobile.alignment || ta;

  const alignMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    inherit: 'inherit',
  };

  return `
.${className} {
  display: flex;
  justify-content: ${alignMap[da] || da};
}
${DEVICE_QUERIES.tablet} {
  .${className} {
    justify-content: ${alignMap[ta] || ta};
  }
}
${DEVICE_QUERIES.mobile} {
  .${className} {
    justify-content: ${alignMap[ma] || ma};
  }
}
`.trim();
}

export { CMS_DEVICES, DEFAULT_DEVICE_RESPONSIVE };
