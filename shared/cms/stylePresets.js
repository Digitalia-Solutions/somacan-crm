export const STYLE_PRESET_SCOPES = ['button', 'card', 'section', 'typography'];

export const BUILTIN_STYLE_PRESETS = {
  button: [
    {
      id: 'button-primary',
      label: 'Primary Button',
      styles: {
        background: '#0f3b2e',
        color: '#fcfaf7',
        border: '1px solid #0f3b2e',
        borderRadius: '999px',
        padding: '0.95rem 1.5rem',
      },
    },
    {
      id: 'button-secondary',
      label: 'Secondary Button',
      styles: {
        background: 'transparent',
        color: '#0f3b2e',
        border: '1px solid rgba(15, 59, 46, 0.24)',
        borderRadius: '999px',
        padding: '0.95rem 1.5rem',
      },
    },
    {
      id: 'button-ghost',
      label: 'Ghost Button',
      styles: {
        background: 'transparent',
        color: '#1c1917',
        border: '1px solid rgba(28, 25, 23, 0.12)',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.25rem',
      },
    },
    {
      id: 'button-solid-dark',
      label: 'Solid Dark',
      styles: {
        background: '#1c1917',
        color: '#fcfaf7',
        border: 'none',
        borderRadius: '0.75rem',
        padding: '1rem 1.5rem',
      },
    },
  ],
  card: [
    {
      id: 'card-soft',
      label: 'Soft Card',
      styles: {
        background: '#ffffff',
        border: '1px solid rgba(28, 25, 23, 0.08)',
        borderRadius: '1.5rem',
        boxShadow: '0 20px 60px rgba(28, 25, 23, 0.08)',
      },
    },
    {
      id: 'card-outline',
      label: 'Outline Card',
      styles: {
        background: 'transparent',
        border: '1px solid rgba(28, 25, 23, 0.16)',
        borderRadius: '1.5rem',
      },
    },
    {
      id: 'card-elevated',
      label: 'Elevated Card',
      styles: {
        background: '#ffffff',
        border: 'none',
        borderRadius: '1.5rem',
        boxShadow: '0 40px 80px rgba(28, 25, 23, 0.12)',
      },
    },
    {
      id: 'card-dark',
      label: 'Dark Card',
      styles: {
        background: '#1c1917',
        color: '#fcfaf7',
        border: 'none',
        borderRadius: '1.5rem',
      },
    },
  ],
  section: [
    {
      id: 'section-default',
      label: 'Default Section',
      styles: {
        backgroundColor: '#fcfaf7',
        padding: '5rem 1.5rem',
      },
    },
    {
      id: 'section-dark',
      label: 'Dark Section',
      styles: {
        backgroundColor: '#1c1917',
        color: '#fcfaf7',
        padding: '5rem 1.5rem',
      },
    },
    {
      id: 'section-bleed',
      label: 'Full Bleed',
      styles: {
        backgroundColor: '#fcfaf7',
        padding: '5rem 0',
      },
    },
    {
      id: 'section-compact',
      label: 'Compact',
      styles: {
        backgroundColor: '#fcfaf7',
        padding: '2.5rem 1.5rem',
      },
    },
  ],
  typography: [
    {
      id: 'type-display',
      label: 'Display',
      styles: {
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        lineHeight: '0.95',
        letterSpacing: '-0.04em',
        fontWeight: 600,
      },
    },
    {
      id: 'type-body',
      label: 'Body',
      styles: {
        fontSize: '1rem',
        lineHeight: '1.7',
        letterSpacing: '0',
      },
    },
    {
      id: 'type-eyebrow',
      label: 'Eyebrow',
      styles: {
        fontSize: '0.75rem',
        lineHeight: '1.2',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
      },
    },
    {
      id: 'type-lead',
      label: 'Lead',
      styles: {
        fontSize: '1.25rem',
        lineHeight: '1.5',
        letterSpacing: '-0.01em',
        fontWeight: 400,
      },
    },
  ],
};

export function getBuiltinStylePreset(scope, id) {
  return (BUILTIN_STYLE_PRESETS[scope] || []).find((preset) => preset.id === id) || null;
}
