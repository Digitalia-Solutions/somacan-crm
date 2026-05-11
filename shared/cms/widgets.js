import { createResponsiveValue } from './responsive.js';

const baseWidgetStyle = {
  presetId: null,
  styles: {},
};

const baseWidgetAnimation = {
  type: 'none',
  duration: 900,
  delay: 0,
  triggerOnScroll: true,
};

export const WIDGET_DEFINITIONS = {
  HeadingWidget: {
    type: 'HeadingWidget',
    label: 'Heading',
    icon: 'heading',
    renderer: 'HeadingWidget',
    fields: [
      { name: 'text', label: 'Text', type: 'text', required: true },
      {
        name: 'level',
        label: 'Level',
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((value) => ({ label: value.toUpperCase(), value })),
      },
      { name: 'fontSize', label: 'Font size', type: 'text', placeholder: 'clamp(2rem,4vw,4rem) or 48px' },
      { name: 'fontFamily', label: 'Font family', type: 'text', placeholder: 'Aariana, serif' },
      { name: 'fontWeight', label: 'Font weight', type: 'text', placeholder: '600' },
      { name: 'color', label: 'Text color', type: 'color' },
      {
        name: 'textAlign',
        label: 'Text align',
        type: 'select',
        options: ['left', 'center', 'right'].map((value) => ({ label: value, value })),
      },
    ],
    defaultProps: { text: 'Section heading', level: 'h2', fontSize: '', fontFamily: '', fontWeight: '', color: '', textAlign: '' },
  },
  ParagraphWidget: {
    type: 'ParagraphWidget',
    label: 'Paragraph',
    icon: 'paragraph',
    renderer: 'ParagraphWidget',
    fields: [
      { name: 'text', label: 'Text', type: 'richtext' },
      { name: 'fontSize', label: 'Font size', type: 'text', placeholder: '18px' },
      { name: 'fontFamily', label: 'Font family', type: 'text', placeholder: 'Manrope, sans-serif' },
      { name: 'fontWeight', label: 'Font weight', type: 'text', placeholder: '400' },
      { name: 'color', label: 'Text color', type: 'color' },
      { name: 'maxWidth', label: 'Max width', type: 'text', placeholder: '42rem' },
      {
        name: 'textAlign',
        label: 'Text align',
        type: 'select',
        options: ['left', 'center', 'right'].map((value) => ({ label: value, value })),
      },
    ],
    defaultProps: {
      text: 'Add supporting body copy here.',
      fontSize: '',
      fontFamily: '',
      fontWeight: '',
      color: '',
      maxWidth: '',
      textAlign: '',
    },
  },
  ButtonWidget: {
    type: 'ButtonWidget',
    label: 'Button',
    icon: 'button',
    renderer: 'ButtonWidget',
    fields: [
      { name: 'label', label: 'Label', type: 'text', required: true },
      { name: 'href', label: 'URL', type: 'text' },
      {
        name: 'variant',
        label: 'Variant',
        type: 'select',
        options: [
          { label: 'Primary', value: 'button-primary' },
          { label: 'Secondary', value: 'button-secondary' },
        ],
      },
      { name: 'fontSize', label: 'Font size', type: 'text', placeholder: '14px' },
      { name: 'fontFamily', label: 'Font family', type: 'text', placeholder: 'Manrope, sans-serif' },
      { name: 'fontWeight', label: 'Font weight', type: 'text', placeholder: '600' },
    ],
    defaultProps: { label: 'Shop now', href: '/shop', variant: 'button-primary', fontSize: '', fontFamily: '', fontWeight: '' },
  },
  ImageWidget: {
    type: 'ImageWidget',
    label: 'Image',
    icon: 'image',
    renderer: 'ImageWidget',
    fields: [
      { name: 'src', label: 'Image', type: 'image' },
      { name: 'alt', label: 'Alt text', type: 'text' },
      { name: 'caption', label: 'Caption', type: 'text' },
      {
        name: 'objectFit',
        label: 'Image fit',
        type: 'select',
        options: ['cover', 'contain', 'fill', 'none', 'scale-down'].map((value) => ({ label: value, value })),
      },
      { name: 'height', label: 'Height', type: 'text', placeholder: '420px' },
      { name: 'width', label: 'Width', type: 'text', placeholder: '100%' },
      { name: 'aspectRatio', label: 'Aspect ratio', type: 'text', placeholder: '4 / 5' },
      { name: 'borderRadius', label: 'Border radius', type: 'text', placeholder: '1.5rem' },
    ],
    defaultProps: {
      src: '',
      alt: '',
      caption: '',
      objectFit: 'cover',
      height: '',
      width: '',
      aspectRatio: '',
      borderRadius: '',
    },
  },
  VideoWidget: {
    type: 'VideoWidget',
    label: 'Video',
    icon: 'video',
    renderer: 'VideoWidget',
    fields: [
      { name: 'src', label: 'Video URL', type: 'text' },
      { name: 'poster', label: 'Poster', type: 'image' },
      { name: 'caption', label: 'Caption', type: 'text' },
    ],
    defaultProps: { src: '', poster: '', caption: '' },
  },
  ProductCardWidget: {
    type: 'ProductCardWidget',
    label: 'Product Card',
    icon: 'product',
    renderer: 'ProductCardWidget',
    fields: [
      { name: 'title', label: 'Product name', type: 'text', required: true },
      { name: 'price', label: 'Price', type: 'text' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'href', label: 'Product URL', type: 'text' },
      {
        name: 'imageFit',
        label: 'Image fit',
        type: 'select',
        options: ['cover', 'contain', 'fill', 'none', 'scale-down'].map((value) => ({ label: value, value })),
      },
      { name: 'imageAspectRatio', label: 'Image aspect ratio', type: 'text', placeholder: '4 / 5' },
      { name: 'titleSize', label: 'Title size', type: 'text', placeholder: '18px' },
      { name: 'titleColor', label: 'Title color', type: 'color' },
      { name: 'priceSize', label: 'Price size', type: 'text', placeholder: '14px' },
      { name: 'priceColor', label: 'Price color', type: 'color' },
    ],
    defaultProps: {
      title: 'Product name',
      price: 'MAD 0',
      image: '',
      href: '/shop',
      imageFit: 'cover',
      imageAspectRatio: '4 / 5',
      titleSize: '',
      titleColor: '',
      priceSize: '',
      priceColor: '',
    },
  },
  CategoryCardWidget: {
    type: 'CategoryCardWidget',
    label: 'Category Card',
    icon: 'category',
    renderer: 'CategoryCardWidget',
    fields: [
      { name: 'title', label: 'Category name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'href', label: 'Category URL', type: 'text' },
      {
        name: 'imageFit',
        label: 'Image fit',
        type: 'select',
        options: ['cover', 'contain', 'fill', 'none', 'scale-down'].map((value) => ({ label: value, value })),
      },
      { name: 'imageAspectRatio', label: 'Image aspect ratio', type: 'text', placeholder: '16 / 10' },
      { name: 'titleSize', label: 'Title size', type: 'text', placeholder: '18px' },
      { name: 'titleColor', label: 'Title color', type: 'color' },
      { name: 'descriptionSize', label: 'Description size', type: 'text', placeholder: '14px' },
      { name: 'descriptionColor', label: 'Description color', type: 'color' },
    ],
    defaultProps: {
      title: 'Category name',
      description: '',
      image: '',
      href: '/shop',
      imageFit: 'cover',
      imageAspectRatio: '16 / 10',
      titleSize: '',
      titleColor: '',
      descriptionSize: '',
      descriptionColor: '',
    },
  },
  SpacerWidget: {
    type: 'SpacerWidget',
    label: 'Spacer',
    icon: 'spacer',
    renderer: 'SpacerWidget',
    fields: [{ name: 'height', label: 'Height', type: 'text' }],
    defaultProps: { height: '2rem' },
  },
  DividerWidget: {
    type: 'DividerWidget',
    label: 'Divider',
    icon: 'divider',
    renderer: 'DividerWidget',
    fields: [
      { name: 'color', label: 'Color', type: 'color' },
      { name: 'thickness', label: 'Thickness', type: 'text' },
    ],
    defaultProps: { color: 'rgba(28, 25, 23, 0.12)', thickness: '1px' },
  },
  IconWidget: {
    type: 'IconWidget',
    label: 'Icon',
    icon: 'icon',
    renderer: 'IconWidget',
    fields: [
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'label', label: 'Label', type: 'text' },
    ],
    defaultProps: { icon: 'sparkles', label: '' },
  },
  TestimonialWidget: {
    type: 'TestimonialWidget',
    label: 'Testimonial',
    icon: 'testimonial',
    renderer: 'TestimonialWidget',
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'image', label: 'Portrait', type: 'image' },
      { name: 'quoteSize', label: 'Quote size', type: 'text', placeholder: '18px' },
      { name: 'quoteColor', label: 'Quote color', type: 'color' },
      { name: 'authorSize', label: 'Author size', type: 'text', placeholder: '16px' },
      { name: 'authorColor', label: 'Author color', type: 'color' },
      { name: 'roleSize', label: 'Role size', type: 'text', placeholder: '14px' },
      { name: 'roleColor', label: 'Role color', type: 'color' },
    ],
    defaultProps: {
      quote: 'A customer quote goes here.',
      author: 'Customer name',
      role: 'Verified buyer',
      image: '',
      quoteSize: '',
      quoteColor: '',
      authorSize: '',
      authorColor: '',
      roleSize: '',
      roleColor: '',
    },
  },
  FAQWidget: {
    type: 'FAQWidget',
    label: 'FAQ',
    icon: 'faq',
    renderer: 'FAQWidget',
    fields: [
      {
        name: 'items',
        label: 'Questions',
        type: 'repeater',
        fields: [
          { name: 'question', label: 'Question', type: 'text', required: true },
          { name: 'answer', label: 'Answer', type: 'textarea', required: true },
        ],
      },
    ],
    defaultProps: {
      items: [
        { question: 'What is included?', answer: 'Add the answer for this FAQ item.' },
      ],
    },
  },
};

export const WIDGET_TYPES = Object.keys(WIDGET_DEFINITIONS);

export function getWidgetDefinition(type) {
  return WIDGET_DEFINITIONS[type] || null;
}

export function createWidgetNode(type, overrides = {}) {
  const definition = getWidgetDefinition(type);
  if (!definition) {
    return null;
  }

  const widgetId = overrides.id || `${type}-${Math.random().toString(36).slice(2, 10)}`;
  return {
    id: widgetId,
    type,
    props: {
      ...(definition.defaultProps || {}),
      ...(overrides.props || {}),
    },
    style: {
      ...baseWidgetStyle,
      ...(overrides.style || {}),
    },
    responsive: createResponsiveValue(overrides.responsive || {}),
    animation: {
      ...baseWidgetAnimation,
      ...(overrides.animation || {}),
    },
  };
}
