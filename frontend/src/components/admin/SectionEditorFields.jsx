import { useEffect, useMemo, useState } from 'react';
import { Braces, Plus, Sparkles, Trash2 } from 'lucide-react';

const FIELD_DEFS = {
  hero: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['WheelHero', 'Hero'] },
    { name: 'title', label: 'Titre principal', type: 'text' },
    { name: 'subtitle', label: 'Texte secondaire', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'logo', label: 'Logo (URL)', type: 'file' },
    { name: 'titleColor', label: 'Couleur du titre', type: 'color' },
    { name: 'titleSize', label: 'Taille du titre', type: 'text', placeholder: 'text-7xl ou 72px' },
    { name: 'subtitleColor', label: 'Couleur du sous-titre', type: 'color' },
    { name: 'subtitleSize', label: 'Taille du sous-titre', type: 'text', placeholder: 'text-xl ou 24px' },
    {
      name: 'products',
      label: 'Produits en vedette',
      type: 'array',
      fields: [
        { name: 'name', label: 'Nom', type: 'text' },
        { name: 'nameColor', label: 'Couleur du nom', type: 'color' },
        { name: 'nameSize', label: 'Taille du nom', type: 'text' },
        { name: 'price', label: 'Prix', type: 'text' },
        { name: 'priceColor', label: 'Couleur du prix', type: 'color' },
        { name: 'priceSize', label: 'Taille du prix', type: 'text' },
        { name: 'image', label: 'Image (URL)', type: 'file' },
        { name: 'bgGradient', label: 'Fond / gradient CSS', type: 'text', placeholder: 'linear-gradient(135deg, #0d1f14, #050e09)' },
        { name: 'accentColor', label: 'Couleur accent', type: 'color' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ],
  section: [
    {
      name: 'type',
      label: 'Composant React',
      type: 'select',
      options: [
        'BrandMarquee',
        'CategorySection',
        'ProductsShowcase',
        'StatsSection',
        'SplitHeroSection',
        'ExpertiseSection',
        'OfferSection',
        'TestimonialsSection',
        'BlogPreview',
        'FaqSection',
        'NewsletterSection',
        'FeaturesBar',
      ],
    },
    { name: 'theme', label: 'Theme', type: 'select', options: ['light', 'dark'] },
    { name: 'title', label: 'Titre principal', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    { name: 'description', label: 'Description / texte', type: 'textarea' },
    { name: 'buttonText', label: 'Texte bouton', type: 'text' },
    { name: 'buttonLink', label: 'Lien bouton', type: 'text' },
  ],
  testimonials: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['TestimonialsSection'] },
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    {
      name: 'items',
      label: 'Avis clients',
      type: 'array',
      fields: [
        { name: 'quote', label: 'Citation', type: 'textarea' },
        { name: 'author', label: 'Auteur', type: 'text' },
        { name: 'city', label: 'Ville', type: 'text' },
      ],
    },
  ],
  categories: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['CategorySection'] },
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    { name: 'categoryIds', label: 'Categories a afficher', type: 'categories' },
  ],
  offer: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['OfferSection'] },
    { name: 'eyebrow', label: 'Petit label', type: 'text' },
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'imageAlt', label: 'Texte alternatif image', type: 'text' },
    { name: 'buttonText', label: 'Texte bouton', type: 'text' },
    { name: 'buttonLink', label: 'Lien bouton', type: 'text' },
    { name: 'badgeText', label: 'Texte badge circulaire', type: 'text' },
    { name: 'image', label: 'Image (URL)', type: 'file' },
  ],
  stats: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['StatsSection'] },
    {
      name: 'items',
      label: 'Statistiques',
      type: 'array',
      fields: [
        { name: 'value', label: 'Valeur', type: 'text' },
        { name: 'suffix', label: 'Suffixe', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' },
        { name: 'desc', label: 'Description', type: 'text' },
        { name: 'icon', label: 'Icone', type: 'text' },
      ],
    },
  ],
  splithero: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['SplitHeroSection'] },
    {
      name: 'items',
      label: 'Cartes split hero',
      type: 'array',
      fields: [
        { name: 'image', label: 'Image (URL)', type: 'file' },
        { name: 'tag', label: 'Tag', type: 'text' },
        { name: 'title', label: 'Titre', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'cta', label: 'Texte CTA', type: 'text' },
        { name: 'slug', label: 'Lien CTA', type: 'text' },
      ],
    },
  ],
  newsletter: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['NewsletterSection'] },
    { name: 'eyebrow', label: 'Petit label', type: 'text' },
    { name: 'title', label: 'Titre principal', type: 'text' },
    { name: 'subtitle', label: 'Texte italic', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'placeholder', label: 'Placeholder email', type: 'text' },
    { name: 'buttonText', label: 'Texte bouton', type: 'text' },
    { name: 'successEyebrow', label: 'Label succes', type: 'text' },
    { name: 'successMessage', label: 'Message succes', type: 'text' },
    { name: 'disclaimer', label: 'Texte legal', type: 'text' },
  ],
  featuresbar: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['FeaturesBar'] },
    {
      name: 'items',
      label: 'Elements du bandeau',
      type: 'array',
      fields: [
        { name: 'label', label: 'Texte', type: 'text' },
      ],
    },
  ],
  brandmarquee: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['BrandMarquee'] },
    {
      name: 'stats',
      label: 'Ligne 1 statistiques',
      type: 'array',
      fields: [
        { name: 'number', label: 'Valeur', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' },
      ],
    },
    {
      name: 'certifications',
      label: 'Ligne 2 elements',
      type: 'array',
      fields: [
        { name: 'label', label: 'Texte', type: 'text' },
      ],
    },
  ],
  productsshowcase: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['ProductsShowcase'] },
    { name: 'eyebrow', label: 'Petit label', type: 'text' },
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    { name: 'ctaText', label: 'Texte lien', type: 'text' },
    { name: 'ctaLink', label: 'Lien', type: 'text' },
  ],
  expertise: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['ExpertiseSection'] },
    { name: 'eyebrow', label: 'Petit label', type: 'text' },
    { name: 'title', label: 'Titre', type: 'text' },
    { name: 'subtitle', label: 'Sous-titre', type: 'text' },
    { name: 'intro', label: 'Introduction droite', type: 'textarea' },
    {
      name: 'items',
      label: 'Services / expertises',
      type: 'array',
      fields: [
        { name: 'num', label: 'Numero', type: 'text' },
        { name: 'icon', label: 'Icone (leaf, flask, sparkles, shield)', type: 'text' },
        { name: 'title', label: 'Titre', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    },
  ],
  faq: [
    { name: 'type', label: 'Composant React', type: 'select', options: ['FaqSection'] },
    { name: 'eyebrow', label: 'Petit label', type: 'text' },
    { name: 'headline', label: 'Titre', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'ctaText', label: 'Texte lien', type: 'text' },
    { name: 'ctaLink', label: 'Lien', type: 'text' },
    {
      name: 'items',
      label: 'Questions',
      type: 'array',
      fields: [
        { name: 'question', label: 'Question', type: 'text' },
        { name: 'answer', label: 'Reponse', type: 'textarea' },
      ],
    },
  ],
};

const STYLE_GROUPS = [
  {
    title: 'Spacing & Layout',
    description: 'Padding, margin, largeur, hauteur et structure du wrapper.',
    fields: [
      { name: 'padding', label: 'Padding global', type: 'text', placeholder: '80px 24px' },
      { name: 'paddingTop', label: 'Padding top', type: 'text', placeholder: '96px' },
      { name: 'paddingRight', label: 'Padding right', type: 'text', placeholder: '24px' },
      { name: 'paddingBottom', label: 'Padding bottom', type: 'text', placeholder: '96px' },
      { name: 'paddingLeft', label: 'Padding left', type: 'text', placeholder: '24px' },
      { name: 'margin', label: 'Margin global', type: 'text', placeholder: '0 auto' },
      { name: 'marginTop', label: 'Margin top', type: 'text', placeholder: '40px' },
      { name: 'marginBottom', label: 'Margin bottom', type: 'text', placeholder: '40px' },
      { name: 'width', label: 'Width', type: 'text', placeholder: '100%' },
      { name: 'maxWidth', label: 'Max width', type: 'text', placeholder: '1440px' },
      { name: 'minHeight', label: 'Min height', type: 'text', placeholder: '70vh' },
      { name: 'display', label: 'Display', type: 'select', options: ['block', 'flex', 'grid', 'inline-block'] },
      { name: 'gap', label: 'Gap', type: 'text', placeholder: '24px' },
      { name: 'justifyContent', label: 'Justify content', type: 'select', options: ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly', 'flex-end'] },
      { name: 'alignItems', label: 'Align items', type: 'select', options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] },
      { name: 'overflow', label: 'Overflow', type: 'select', options: ['visible', 'hidden', 'clip', 'scroll'] },
    ],
  },
  {
    title: 'Colors & Surface',
    description: 'Fond, texte, bordures, opacite et ombres.',
    fields: [
      { name: 'backgroundColor', label: 'Couleur de fond', type: 'color' },
      { name: 'color', label: 'Couleur du texte', type: 'color' },
      { name: 'borderColor', label: 'Couleur de bordure', type: 'color' },
      { name: 'borderWidth', label: 'Epaisseur bordure', type: 'text', placeholder: '1px' },
      { name: 'borderStyle', label: 'Style bordure', type: 'select', options: ['solid', 'dashed', 'dotted', 'double', 'none'] },
      { name: 'borderRadius', label: 'Rayon de bordure', type: 'text', placeholder: '32px' },
      { name: 'boxShadow', label: 'Ombre', type: 'text', placeholder: '0 30px 90px rgba(0,0,0,0.12)' },
      { name: 'opacity', label: 'Opacite', type: 'number', min: 0, max: 1, step: 0.05 },
    ],
  },
  {
    title: 'Background Media',
    description: 'Image, taille, position et repetition du fond.',
    fields: [
      { name: 'backgroundImage', label: 'Image de fond', type: 'text', placeholder: 'url(https://...) ou linear-gradient(...)' },
      { name: 'backgroundSize', label: 'Background size', type: 'text', placeholder: 'cover' },
      { name: 'backgroundPosition', label: 'Background position', type: 'text', placeholder: 'center center' },
      { name: 'backgroundRepeat', label: 'Background repeat', type: 'select', options: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'] },
    ],
  },
  {
    title: 'Typography',
    description: 'Applique les styles au wrapper; utile pour les sections qui heritent du texte du conteneur.',
    fields: [
      { name: 'fontFamily', label: 'Font family', type: 'text', placeholder: '"Cormorant Garamond", serif' },
      { name: 'fontSize', label: 'Font size', type: 'text', placeholder: '18px' },
      { name: 'fontWeight', label: 'Font weight', type: 'text', placeholder: '600' },
      { name: 'lineHeight', label: 'Line height', type: 'text', placeholder: '1.5' },
      { name: 'letterSpacing', label: 'Letter spacing', type: 'text', placeholder: '0.08em' },
      { name: 'textAlign', label: 'Text align', type: 'select', options: ['left', 'center', 'right', 'justify'] },
      { name: 'textTransform', label: 'Text transform', type: 'select', options: ['none', 'uppercase', 'lowercase', 'capitalize'] },
    ],
  },
];

function FieldLabel({ children, hint }) {
  return (
    <div className="mb-1">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{children}</label>
      {hint ? <p className="mt-1 text-xs text-stone-400">{hint}</p> : null}
    </div>
  );
}

function renderPrimitiveInput({ field, value, onChange }) {
  if (field.type === 'textarea' || field.type === 'richtext') {
    return (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={field.type === 'richtext' ? 8 : 4}
        placeholder={field.placeholder || ''}
        className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-colors focus:border-stone-900"
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition-colors focus:border-stone-900"
      >
        <option value="">-- Choisir --</option>
        {(field.options || []).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'number') {
    return (
      <input
        type="number"
        min={field.min}
        max={field.max}
        step={field.step || 1}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={field.placeholder || ''}
        className="mt-1 h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition-colors focus:border-stone-900"
      />
    );
  }

  if (field.type === 'color') {
    const normalized = typeof value === 'string' && value ? value : '#000000';
    return (
      <div className="mt-1 flex items-center gap-3">
        <input
          type="color"
          value={normalized}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-16 rounded-xl border border-stone-200 bg-white p-1"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || '#000000'}
          className="h-11 flex-1 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition-colors focus:border-stone-900"
        />
      </div>
    );
  }

  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || (field.type === 'file' ? 'https://...' : '')}
      className="mt-1 h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition-colors focus:border-stone-900"
    />
  );
}

function ArrayField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  function addItem() {
    const empty = {};
    (field.fields || []).forEach((subField) => {
      empty[subField.name] = '';
    });
    onChange([...items, empty]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  function updateItem(index, subName, subValue) {
    onChange(items.map((item, i) => (i === index ? { ...item, [subName]: subValue } : item)));
  }

  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <FieldLabel>{field.label}</FieldLabel>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-600 hover:border-stone-900 hover:text-stone-900"
        >
          <Plus size={12} />
          Ajouter
        </button>
      </div>

      <div className="mt-3 grid gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">Element {idx + 1}</p>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {(field.fields || []).map((sub) => (
                <div key={sub.name} className={sub.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <FieldLabel>{sub.label}</FieldLabel>
                  {renderPrimitiveInput({
                    field: sub,
                    value: item[sub.name],
                    onChange: (nextValue) => updateItem(idx, sub.name, nextValue),
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryPicker({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const selectedIds = Array.isArray(value) ? value.map(String) : [];

  useEffect(() => {
    import('../../lib/api')
      .then((api) => api.getCategories())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  function toggle(id) {
    const next = String(id);
    if (selectedIds.includes(next)) {
      onChange(selectedIds.filter((item) => item !== next));
      return;
    }
    onChange([...selectedIds, next]);
  }

  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => toggle(category.id)}
          className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
            selectedIds.includes(String(category.id))
              ? 'border-stone-900 bg-stone-900 text-white'
              : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-400'
          }`}
        >
          <div className="h-9 w-9 overflow-hidden rounded-xl bg-white/10 shrink-0">
            {category.image ? <img src={category.image} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <span className="truncate text-[11px] font-bold uppercase tracking-[0.12em]">{category.name}</span>
        </button>
      ))}
    </div>
  );
}

function StyleEditor({ content, onChange }) {
  const style = typeof content?.style === 'object' && content?.style ? content.style : {};

  function updateStyleField(name, value) {
    const nextStyle = { ...style };
    if (value === '' || value === null || value === undefined) {
      delete nextStyle[name];
    } else {
      nextStyle[name] = value;
    }
    onChange({ ...content, style: nextStyle });
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(135deg,#faf7f2,white)] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-stone-900 p-2 text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">Design Inspector</p>
            <h4 className="mt-1 font-display text-2xl text-somacan-brand">Controle visuel du wrapper</h4>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Ces reglages agissent sur le conteneur externe de la section. Pour cibler des titres,
              boutons ou sous-elements internes, utilisez aussi le CSS personnalise dans l’onglet avance.
            </p>
          </div>
        </div>
      </div>

      {STYLE_GROUPS.map((group) => (
        <div key={group.title} className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">{group.title}</p>
            <p className="mt-1 text-sm text-stone-500">{group.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.name}>
                <FieldLabel>{field.label}</FieldLabel>
                {renderPrimitiveInput({
                  field,
                  value: style[field.name],
                  onChange: (nextValue) => updateStyleField(field.name, nextValue),
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdvancedEditor({ content, onChange }) {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(content || {}, null, 2));
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    setJsonText(JSON.stringify(content || {}, null, 2));
    setJsonError('');
  }, [content]);

  function updateStyleField(name, value) {
    const currentStyle = typeof content?.style === 'object' && content?.style ? content.style : {};
    const nextStyle = { ...currentStyle };
    if (!value) {
      delete nextStyle[name];
    } else {
      nextStyle[name] = value;
    }
    onChange({ ...content, style: nextStyle });
  }

  function applyJson(value) {
    setJsonText(value);
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
      setJsonError('');
    } catch {
      setJsonError('JSON invalide. Corrigez la syntaxe avant de sauvegarder.');
    }
  }

  const customCss = typeof content?.style?.customCss === 'string' ? content.style.customCss : '';
  const customClasses = typeof content?.style?.customClasses === 'string' ? content.style.customClasses : '';

  return (
    <div className="grid gap-4">
      <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
        <FieldLabel hint="Utilisez `&` pour cibler le wrapper de la section. Exemple: `& h2 { font-size: 72px; }`">
          CSS personnalise scope
        </FieldLabel>
        <textarea
          rows={8}
          value={customCss}
          onChange={(e) => updateStyleField('customCss', e.target.value)}
          placeholder={'& {\n  padding: 120px 24px;\n}\n\n& h2 {\n  font-size: 72px;\n  letter-spacing: -0.04em;\n}\n\n& .cta {\n  border-radius: 999px;\n}'}
          className="mt-1 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-stone-900"
        />
      </div>

      <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
        <FieldLabel hint="Ajoute des classes supplementaires au bloc de la section.">
          Classes supplementaires stockees dans content.style.customClasses
        </FieldLabel>
        <input
          type="text"
          value={customClasses}
          onChange={(e) => updateStyleField('customClasses', e.target.value)}
          placeholder="ex: isolate overflow-hidden"
          className="mt-1 h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none transition-colors focus:border-stone-900"
        />
      </div>

      <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-stone-900 p-2 text-white">
            <Braces size={16} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400">Raw JSON</p>
            <h4 className="font-display text-2xl text-somacan-brand">Controle total de la section</h4>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          Ici vous pouvez modifier tout l’objet `content` manuellement: textes, tableaux, props de composants,
          style du wrapper, variants, CTA, images, etc.
        </p>
        <textarea
          rows={18}
          value={jsonText}
          onChange={(e) => applyJson(e.target.value)}
          className="mt-4 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-stone-900"
        />
        {jsonError ? <p className="mt-2 text-sm text-red-600">{jsonError}</p> : null}
      </div>
    </div>
  );
}

function ContentEditor({ contentType, content, onChange }) {
  let fields = [...(FIELD_DEFS[contentType] || [])];

  const rawType = content?.type || '';
  const subType = rawType.replace('Section', '').toLowerCase();

  if (contentType === 'section' && subType && FIELD_DEFS[subType]) {
    const subFields = FIELD_DEFS[subType].filter((subField) => !fields.find((field) => field.name === subField.name));
    fields = [...fields, ...subFields];
  }

  function updateField(name, value) {
    onChange({ ...content, [name]: value });
  }

  if (!fields.length) {
    return (
      <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
        <p className="text-sm leading-6 text-stone-500">
          Aucun champ structure n’est defini pour ce type. Utilisez l’onglet avance pour modifier le JSON brut.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {fields.map((field) => {
        if (field.type === 'categories') {
          return (
            <div key={field.name} className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
              <FieldLabel>{field.label}</FieldLabel>
              <CategoryPicker value={content[field.name]} onChange={(nextValue) => updateField(field.name, nextValue)} />
            </div>
          );
        }

        if (field.type === 'array') {
          return (
            <ArrayField
              key={field.name}
              field={field}
              value={content[field.name]}
              onChange={(nextValue) => updateField(field.name, nextValue)}
            />
          );
        }

        return (
          <div key={field.name} className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
            <FieldLabel>{field.label}</FieldLabel>
            {renderPrimitiveInput({
              field,
              value: content[field.name],
              onChange: (nextValue) => updateField(field.name, nextValue),
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function SectionEditorFields({ contentType, content, onChange, mode = 'content' }) {
  const normalizedContent = useMemo(() => (typeof content === 'object' && content ? content : {}), [content]);

  if (mode === 'design') {
    return <StyleEditor content={normalizedContent} onChange={onChange} />;
  }

  if (mode === 'advanced') {
    return <AdvancedEditor content={normalizedContent} onChange={onChange} />;
  }

  return <ContentEditor contentType={contentType} content={normalizedContent} onChange={onChange} />;
}
