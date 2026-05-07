/**
 * TemplateEngine.js
 *
 * Frontend template validation, SEO resolution, and layout rule enforcement.
 * Consumes shared/cms/templates.js definitions.
 */

import {
  getTemplateDefinition,
  TEMPLATE_REGISTRY,
  isSectionAllowedForTemplate,
} from '../../../../shared/cms/templates.js';

/**
 * Validate whether a page's sections conform to a template's allowed types.
 * @param {Array} sections - Page sections
 * @param {string} templateKey - Template key
 * @returns {Object} { valid: boolean, violations: Array<string> }
 */
export function validatePageAgainstTemplate(sections = [], templateKey) {
  const definition = getTemplateDefinition(templateKey);
  const violations = [];

  for (const section of sections) {
    if (!isSectionAllowedForTemplate(templateKey, section.type)) {
      violations.push(
        `Section "${section.name || section.type}" (${section.type}) is not allowed in template "${definition.label}".`
      );
    }
  }

  return { valid: violations.length === 0, violations };
}

/**
 * Merge template SEO defaults with page-specific overrides.
 * @param {Object} page - Page object (metaTitle, metaDescription, ogImage, canonicalUrl)
 * @param {string} templateKey - Template key
 * @returns {Object} Resolved SEO metadata
 */
export function resolvePageSEO(page = {}, templateKey) {
  const definition = getTemplateDefinition(templateKey);
  const defaults = definition.seoDefaults || {};

  return {
    metaTitle: page.metaTitle || defaults.metaTitle || '',
    metaDescription: page.metaDescription || defaults.metaDescription || '',
    ogImage: page.ogImage || defaults.ogImage || '',
    canonicalUrl: page.canonicalUrl || defaults.canonicalUrl || '',
    robots: defaults.robots || 'index,follow',
  };
}

/**
 * Get layout rules for a template.
 * @param {string} templateKey
 * @returns {Object} Layout rules
 */
export function getTemplateLayoutRules(templateKey) {
  const definition = getTemplateDefinition(templateKey);
  return definition.layoutRules || {};
}

/**
 * Enforce template constraints on a section array.
 * Returns a new sections array with constraints applied (does not mutate).
 * @param {Array} sections
 * @param {string} templateKey
 * @returns {Object} { sections, warnings: Array<string> }
 */
export function enforceTemplateConstraints(sections = [], templateKey) {
  const definition = getTemplateDefinition(templateKey);
  const rules = definition.layoutRules || {};
  const warnings = [];
  let result = [...sections];

  // Max sections
  if (rules.maxSections && result.length > rules.maxSections) {
    warnings.push(
      `Template "${definition.label}" allows max ${rules.maxSections} sections. Truncated from ${result.length}.`
    );
    result = result.slice(0, rules.maxSections);
  }

  // Hero required — check if first section is a hero type
  if (rules.heroRequired) {
    const heroTypes = ['Hero', 'HeroSectionV2', 'WheelHero', 'SplitHeroSection'];
    const hasHero = result.some((s) => heroTypes.includes(s.type));
    if (!hasHero) {
      warnings.push(
        `Template "${definition.label}" requires a hero section.`
      );
    }
  }

  // First section full-screen
  if (rules.firstSectionFullScreen && result.length > 0) {
    const first = { ...result[0], settings: { ...result[0].settings, minHeight: '100vh' } };
    result = [first, ...result.slice(1)];
  }

  return { sections: result, warnings };
}

/**
 * Get responsive rules for a template.
 * @param {string} templateKey
 * @returns {Object}
 */
export function getTemplateResponsiveRules(templateKey) {
  const definition = getTemplateDefinition(templateKey);
  return definition.responsiveRules || {};
}

/**
 * Build a template-aware page configuration object.
 * @param {Object} page
 * @returns {Object} Enriched page config
 */
export function buildPageConfig(page = {}) {
  const templateKey = page.template || 'custom';
  const definition = getTemplateDefinition(templateKey);

  return {
    ...page,
    templateDefinition: definition,
    seo: resolvePageSEO(page, templateKey),
    layoutRules: getTemplateLayoutRules(templateKey),
    responsiveRules: getTemplateResponsiveRules(templateKey),
  };
}

export { TEMPLATE_REGISTRY, getTemplateDefinition, isSectionAllowedForTemplate };
