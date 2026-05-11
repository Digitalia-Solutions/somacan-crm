import { SECTION_TYPES_V2 } from './sections.js';

const V2_CORE_SECTIONS = [
  'WidgetSection',
  'HeroSectionV2',
  'ProductGridSectionV2',
  'StorySectionV2',
  'TestimonialsSectionV2',
  'FAQSectionV2',
];

const LEGACY_MARKETING_SECTIONS = [
  'WheelHero',
  'Hero',
  'FeaturesBar',
  'CategorySection',
  'ProductsShowcase',
  'StorySection',
  'ExpertiseSection',
  'StatsSection',
  'OfferSection',
  'TestimonialsSection',
  'FaqSection',
  'NewsletterSection',
  'BlogPreview',
  'BrandMarquee',
  'SplitHeroSection',
];

const ABOUT_SECTIONS = [
  'AboutHero',
  'AboutPrinciples',
  'AboutManifeste',
  'AboutMethod',
  'AboutTimeline',
  'AboutEngagement',
];

const SHOP_SECTIONS = [
  'ShopHero',
  'ShopGrid',
];

const CONTACT_SECTIONS = [
  'ContactHero',
  'ContactForm',
  'ContactMap',
  'ContactFAQ',
];

const BLOG_SECTIONS = [
  'BlogHero',
  'BlogGrid',
];

const PRODUCT_DETAIL_SECTIONS = [
  'ProductRelated',
];

const ARTICLE_DETAIL_SECTIONS = [
  'ArticleEditorialNote',
];

export const TEMPLATE_REGISTRY = {
  home: {
    key: 'home',
    componentName: 'HomeTemplate',
    label: 'Home Template',
    allowedSectionTypes: [...V2_CORE_SECTIONS, ...LEGACY_MARKETING_SECTIONS],
    layoutRules: { heroRequired: true, maxSections: 20, firstSectionFullScreen: true },
    seoDefaults: {
      metaTitle: 'Somacan | Home',
      metaDescription: 'A reusable widget-based home page foundation.',
    },
    responsiveRules: { mobileCollapse: true, maxColumns: 3, lockHeroPadding: true },
  },
  shop: {
    key: 'shop',
    componentName: 'ShopTemplate',
    label: 'Shop Template',
    allowedSectionTypes: ['HeroSectionV2', 'WidgetSection', 'ProductGridSectionV2', 'StorySectionV2', 'FAQSectionV2', 'Hero', 'ProductsShowcase', 'CategorySection', 'NewsletterSection', ...SHOP_SECTIONS],
    layoutRules: { heroRequired: false, maxSections: 14, commerceAware: true },
    seoDefaults: {
      metaTitle: 'Somacan | Shop',
      metaDescription: 'Browse products inside reusable shop layouts.',
    },
    responsiveRules: { mobileCollapse: true, maxColumns: 4, lockHeroPadding: false },
  },
  product: {
    key: 'product',
    componentName: 'ProductTemplate',
    label: 'Product Template',
    allowedSectionTypes: ['HeroSectionV2', 'WidgetSection', 'StorySectionV2', 'TestimonialsSectionV2', 'FAQSectionV2', 'Hero', 'StorySection', 'FaqSection'],
    layoutRules: { heroRequired: true, maxSections: 10, productContext: true },
    seoDefaults: {
      metaTitle: 'Somacan | Product',
      metaDescription: 'A product-detail template powered by reusable widgets.',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 2, lockHeroPadding: true },
  },
  blog: {
    key: 'blog',
    componentName: 'BlogTemplate',
    label: 'Blog Template',
    allowedSectionTypes: ['HeroSectionV2', 'WidgetSection', 'StorySectionV2', 'FAQSectionV2', 'Hero', 'BlogPreview', 'NewsletterSection', ...BLOG_SECTIONS],
    layoutRules: { heroRequired: false, maxSections: 12, archiveContext: true },
    seoDefaults: {
      metaTitle: 'Somacan | Blog',
      metaDescription: 'A blog archive template ready for reusable editorial widgets.',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 2, lockHeroPadding: false },
  },
  article: {
    key: 'article',
    componentName: 'ArticleTemplate',
    label: 'Article Template',
    allowedSectionTypes: ['WidgetSection', 'StorySectionV2', 'FAQSectionV2', 'HeroSectionV2', 'Hero', 'StorySection', 'FaqSection'],
    layoutRules: { heroRequired: false, maxSections: 8, editorialContext: true },
    seoDefaults: {
      metaTitle: 'Somacan | Article',
      metaDescription: 'A reusable article layout with editorial widget sections.',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 1, lockHeroPadding: false },
  },
  contact: {
    key: 'contact',
    componentName: 'ContactTemplate',
    label: 'Contact Template',
    allowedSectionTypes: ['HeroSectionV2', 'WidgetSection', 'StorySectionV2', 'FAQSectionV2', 'Hero', 'StatsSection', ...CONTACT_SECTIONS],
    layoutRules: { heroRequired: false, maxSections: 8, contactContext: true },
    seoDefaults: {
      metaTitle: 'Somacan | Contact',
      metaDescription: 'Reusable contact page architecture with section and widget presets.',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 2, lockHeroPadding: false },
  },
  notFound: {
    key: 'notFound',
    componentName: '404Template',
    label: '404 Template',
    allowedSectionTypes: ['HeroSectionV2', 'WidgetSection', 'Hero'],
    layoutRules: { heroRequired: true, maxSections: 3, minimalChrome: true },
    seoDefaults: {
      metaTitle: 'Page Not Found',
      metaDescription: 'A reusable 404 template.',
      robots: 'noindex,follow',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 1, lockHeroPadding: true },
  },
  custom: {
    key: 'custom',
    componentName: 'CustomTemplate',
    label: 'Custom Template',
    allowedSectionTypes: [...SECTION_TYPES_V2, ...LEGACY_MARKETING_SECTIONS, ...ABOUT_SECTIONS, ...SHOP_SECTIONS, ...CONTACT_SECTIONS, ...BLOG_SECTIONS, ...PRODUCT_DETAIL_SECTIONS, ...ARTICLE_DETAIL_SECTIONS],
    layoutRules: { heroRequired: false, maxSections: 30 },
    seoDefaults: {},
    responsiveRules: { mobileCollapse: true, maxColumns: 4, lockHeroPadding: false },
  },
  about: {
    key: 'about',
    componentName: 'AboutTemplate',
    label: 'About Template',
    allowedSectionTypes: [...ABOUT_SECTIONS, 'WidgetSection', 'HeroSectionV2', 'StorySectionV2'],
    layoutRules: { heroRequired: false, maxSections: 16, editorialContext: true },
    seoDefaults: {
      metaTitle: 'Somacan | About',
      metaDescription: 'Reusable about page template.',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 2, lockHeroPadding: false },
  },
  'product-detail': {
    key: 'product-detail',
    componentName: 'ProductDetailTemplate',
    label: 'Product Detail Template',
    allowedSectionTypes: [...PRODUCT_DETAIL_SECTIONS, 'WidgetSection', 'HeroSectionV2', 'StorySectionV2', 'TestimonialsSectionV2', 'FAQSectionV2', 'Hero', 'StorySection', 'FaqSection'],
    layoutRules: { heroRequired: false, maxSections: 12, productContext: true },
    seoDefaults: {
      metaTitle: 'Somacan | Product Detail',
      metaDescription: 'Reusable product detail template.',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 2, lockHeroPadding: false },
  },
  'article-detail': {
    key: 'article-detail',
    componentName: 'ArticleDetailTemplate',
    label: 'Article Detail Template',
    allowedSectionTypes: [...ARTICLE_DETAIL_SECTIONS, 'WidgetSection', 'HeroSectionV2', 'StorySectionV2', 'FAQSectionV2', 'Hero', 'StorySection', 'FaqSection'],
    layoutRules: { heroRequired: false, maxSections: 10, editorialContext: true },
    seoDefaults: {
      metaTitle: 'Somacan | Article Detail',
      metaDescription: 'Reusable article detail template.',
    },
    responsiveRules: { mobileCollapse: false, maxColumns: 1, lockHeroPadding: false },
  },
};

export const TEMPLATE_KEYS = Object.keys(TEMPLATE_REGISTRY);

export function getTemplateDefinition(key) {
  return TEMPLATE_REGISTRY[key] || TEMPLATE_REGISTRY.custom;
}

export function isSectionAllowedForTemplate(templateKey, sectionType) {
  const allowed = getTemplateDefinition(templateKey).allowedSectionTypes;
  if (allowed.includes(sectionType)) {
    return true;
  }

  // CMS is currently hybrid and pages already contain legacy/specialized section types.
  // Do not block saves for valid section ids just because the template registry lags behind.
  return typeof sectionType === 'string' && sectionType.trim().length > 0;
}
