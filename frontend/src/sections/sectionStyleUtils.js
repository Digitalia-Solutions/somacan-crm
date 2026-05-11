export function buildTypographyStyle(props = {}, prefix = '') {
  const normalized = prefix ? `${prefix[0].toLowerCase()}${prefix.slice(1)}` : '';
  const get = (suffix) => props[`${normalized}${suffix}`];

  return {
    color: get('Color') || undefined,
    fontSize: get('FontSize') || undefined,
    fontFamily: get('FontFamily') || undefined,
    fontWeight: get('FontWeight') || undefined,
    lineHeight: get('LineHeight') || undefined,
    letterSpacing: get('LetterSpacing') || undefined,
    textAlign: get('Align') || undefined,
  };
}

export function buildImageStyle(props = {}, prefix = 'image') {
  const normalized = prefix ? `${prefix[0].toLowerCase()}${prefix.slice(1)}` : 'image';
  const get = (suffix) => props[`${normalized}${suffix}`];

  return {
    objectFit: get('Fit') || undefined,
    objectPosition: get('Position') || undefined,
    aspectRatio: get('AspectRatio') || undefined,
    width: get('Width') || undefined,
    height: get('Height') || undefined,
    borderRadius: get('Radius') || undefined,
    opacity: get('Opacity') || undefined,
  };
}

export function buildSectionLayoutStyle({
  minHeight,
  contentMaxWidth,
  contentGap,
  alignItems,
  justifyContent,
  columnsTemplate,
} = {}) {
  return {
    ...(minHeight ? { minHeight } : {}),
    ...(contentMaxWidth ? { maxWidth: contentMaxWidth, marginInline: 'auto' } : {}),
    ...(contentGap ? { gap: contentGap } : {}),
    ...(alignItems ? { alignItems } : {}),
    ...(justifyContent ? { justifyContent } : {}),
    ...(columnsTemplate ? { gridTemplateColumns: columnsTemplate } : {}),
  };
}

export function mediaFieldGroup(prefix = 'image', label = 'Image') {
  return [
    {
      name: `${prefix}Fit`,
      label: `${label} fit`,
      type: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'].map((value) => ({ label: value, value })),
    },
    { name: `${prefix}AspectRatio`, label: `${label} ratio`, type: 'text', placeholder: '4 / 5' },
    { name: `${prefix}Width`, label: `${label} width`, type: 'text', placeholder: '100%' },
    { name: `${prefix}Height`, label: `${label} height`, type: 'text', placeholder: '420px' },
    { name: `${prefix}Position`, label: `${label} position`, type: 'text', placeholder: 'center center' },
    { name: `${prefix}Radius`, label: `${label} radius`, type: 'text', placeholder: '2rem' },
    { name: `${prefix}Opacity`, label: `${label} opacity`, type: 'text', placeholder: '1' },
  ];
}

export function typographyFieldGroup(prefix = 'title', label = 'Titre') {
  return [
    { name: `${prefix}Color`, label: `${label} color`, type: 'color' },
    { name: `${prefix}FontSize`, label: `${label} size`, type: 'text', placeholder: '48px' },
    { name: `${prefix}FontFamily`, label: `${label} font`, type: 'text', placeholder: 'Aariana, serif' },
    { name: `${prefix}FontWeight`, label: `${label} weight`, type: 'text', placeholder: '600' },
    { name: `${prefix}LineHeight`, label: `${label} line-height`, type: 'text', placeholder: '1.1' },
    { name: `${prefix}LetterSpacing`, label: `${label} letter spacing`, type: 'text', placeholder: '-0.03em' },
    {
      name: `${prefix}Align`,
      label: `${label} align`,
      type: 'select',
      options: ['left', 'center', 'right'].map((value) => ({ label: value, value })),
    },
  ];
}

export function layoutFieldGroup() {
  return [
    { name: 'sectionMinHeight', label: 'Hauteur min section', type: 'text', placeholder: '80vh' },
    { name: 'contentMaxWidth', label: 'Largeur max interne', type: 'text', placeholder: '1200px' },
    { name: 'contentGap', label: 'Espace interne', type: 'text', placeholder: '4rem' },
    { name: 'columnsTemplate', label: 'Colonnes CSS', type: 'text', placeholder: '5fr 6fr' },
    {
      name: 'alignItems',
      label: 'Align items',
      type: 'select',
      options: ['stretch', 'flex-start', 'center', 'flex-end'].map((value) => ({ label: value, value })),
    },
    {
      name: 'justifyContent',
      label: 'Justify content',
      type: 'select',
      options: ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly', 'flex-end'].map((value) => ({ label: value, value })),
    },
  ];
}
