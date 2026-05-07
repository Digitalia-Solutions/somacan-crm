import { createResponsiveValue } from './responsive.js';
import { createWidgetNode } from './widgets.js';

const SHARED_WIDGET_SECTION_SETTINGS = {
  presetId: 'section-default',
  backgroundColor: '#fcfaf7',
  contentWidth: '1200px',
  gap: '1.5rem',
};

export const SECTION_DEFINITIONS = {
  WidgetSection: {
    type: 'WidgetSection',
    label: 'Flexible Widget Section',
    icon: 'layout',
    isWidgetSection: true,
    allowedWidgets: '*',
    layoutRules: {
      columns: 'custom',
      supportsLayering: true,
    },
    defaultSettings: {
      ...SHARED_WIDGET_SECTION_SETTINGS,
    },
    defaultWidgetTree: [
      createWidgetNode('HeadingWidget'),
      createWidgetNode('ParagraphWidget'),
      createWidgetNode('ButtonWidget'),
    ],
  },
  HeroSectionV2: {
    type: 'HeroSectionV2',
    label: 'Hero Section V2',
    icon: 'sparkles',
    isWidgetSection: true,
    allowedWidgets: ['HeadingWidget', 'ParagraphWidget', 'ButtonWidget', 'ImageWidget', 'VideoWidget', 'IconWidget', 'SpacerWidget'],
    layoutRules: {
      columns: 2,
      hero: true,
      fullWidth: true,
    },
    defaultSettings: {
      ...SHARED_WIDGET_SECTION_SETTINGS,
      presetId: 'section-dark',
      backgroundColor: '#1c1917',
      minHeight: '80vh',
    },
    defaultWidgetTree: [
      createWidgetNode('HeadingWidget', { props: { text: 'Build reusable landing pages.', level: 'h1' } }),
      createWidgetNode('ParagraphWidget', { props: { text: 'Compose sections with widgets instead of hard-coded content blocks.' } }),
      createWidgetNode('ButtonWidget', { props: { label: 'Explore templates', href: '/shop' } }),
      createWidgetNode('ImageWidget'),
    ],
  },
  ProductGridSectionV2: {
    type: 'ProductGridSectionV2',
    label: 'Product Grid V2',
    icon: 'grid',
    isWidgetSection: true,
    allowedWidgets: ['HeadingWidget', 'ParagraphWidget', 'ProductCardWidget', 'ButtonWidget', 'DividerWidget'],
    layoutRules: {
      columns: 3,
      collection: true,
    },
    defaultSettings: {
      ...SHARED_WIDGET_SECTION_SETTINGS,
    },
    defaultWidgetTree: [
      createWidgetNode('HeadingWidget', { props: { text: 'Featured products' } }),
      createWidgetNode('ParagraphWidget', { props: { text: 'Curate product cards inside a reusable product grid section.' } }),
      createWidgetNode('ProductCardWidget'),
      createWidgetNode('ProductCardWidget', { props: { title: 'Second product' } }),
      createWidgetNode('ProductCardWidget', { props: { title: 'Third product' } }),
    ],
  },
  StorySectionV2: {
    type: 'StorySectionV2',
    label: 'Story Section V2',
    icon: 'story',
    isWidgetSection: true,
    allowedWidgets: ['HeadingWidget', 'ParagraphWidget', 'ImageWidget', 'ButtonWidget', 'DividerWidget', 'SpacerWidget'],
    layoutRules: {
      columns: 2,
      editorial: true,
    },
    defaultSettings: {
      ...SHARED_WIDGET_SECTION_SETTINGS,
    },
    defaultWidgetTree: [
      createWidgetNode('HeadingWidget', { props: { text: 'Tell a richer brand story.' } }),
      createWidgetNode('ParagraphWidget', { props: { text: 'Pair copy, imagery, and calls to action without inventing a dedicated section component every time.' } }),
      createWidgetNode('ImageWidget'),
    ],
  },
  TestimonialsSectionV2: {
    type: 'TestimonialsSectionV2',
    label: 'Testimonials V2',
    icon: 'testimonial',
    isWidgetSection: true,
    allowedWidgets: ['HeadingWidget', 'ParagraphWidget', 'TestimonialWidget', 'SpacerWidget'],
    layoutRules: {
      columns: 3,
      collection: true,
    },
    defaultSettings: {
      ...SHARED_WIDGET_SECTION_SETTINGS,
    },
    defaultWidgetTree: [
      createWidgetNode('HeadingWidget', { props: { text: 'What customers are saying' } }),
      createWidgetNode('TestimonialWidget'),
      createWidgetNode('TestimonialWidget', { props: { author: 'Customer two' } }),
      createWidgetNode('TestimonialWidget', { props: { author: 'Customer three' } }),
    ],
  },
  FAQSectionV2: {
    type: 'FAQSectionV2',
    label: 'FAQ Section V2',
    icon: 'faq',
    isWidgetSection: true,
    allowedWidgets: ['HeadingWidget', 'ParagraphWidget', 'FAQWidget', 'DividerWidget'],
    layoutRules: {
      columns: 1,
      collection: true,
    },
    defaultSettings: {
      ...SHARED_WIDGET_SECTION_SETTINGS,
    },
    defaultWidgetTree: [
      createWidgetNode('HeadingWidget', { props: { text: 'Frequently asked questions' } }),
      createWidgetNode('FAQWidget'),
    ],
  },
};

export const SECTION_TYPES_V2 = Object.keys(SECTION_DEFINITIONS);

export function getSectionDefinition(type) {
  return SECTION_DEFINITIONS[type] || null;
}

export function isWidgetSectionType(type) {
  return Boolean(getSectionDefinition(type)?.isWidgetSection);
}

export function createSectionBlueprint(type) {
  const definition = getSectionDefinition(type);
  if (!definition) {
    return null;
  }

  return {
    type,
    settings: {
      ...(definition.defaultSettings || {}),
    },
    responsive: createResponsiveValue(),
    widgetTree: (definition.defaultWidgetTree || []).map((widget) => ({
      ...widget,
      props: { ...(widget.props || {}) },
      style: { ...(widget.style || {}) },
      responsive: createResponsiveValue(widget.responsive || {}),
      animation: { ...(widget.animation || {}) },
    })),
  };
}
