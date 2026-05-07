import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import SectionEditorFields from './SectionEditorFields';
import AnimationPicker from './AnimationPicker';

const CONTENT_TYPES = ['hero', 'section', 'categories', 'faq', 'stats', 'gallery', 'form', 'menu', 'theme', 'footer'];

const TABS = [
  { key: 'basic', label: 'General' },
  { key: 'content', label: 'Contenu' },
  { key: 'design', label: 'Design' },
  { key: 'animation', label: 'Animation' },
  { key: 'advanced', label: 'Avance' },
];

function buildInitialState(section, pageKey) {
  if (section) {
    return {
      sectionKey: section.sectionKey || '',
      title: section.title || '',
      contentType: section.contentType || 'section',
      content: section.content || {},
      animation: section.animation || 'none',
      animationDelay: section.animationDelay ?? 0,
      active: section.active !== false,
      sortOrder: section.sortOrder ?? 0,
      pageKey: section.pageKey || pageKey || '',
      cssClasses: section.cssClasses || '',
    };
  }

  return {
    sectionKey: '',
    title: '',
    contentType: 'section',
    content: {},
    animation: 'none',
    animationDelay: 0,
    active: true,
    sortOrder: 0,
    pageKey: pageKey || '',
    cssClasses: '',
  };
}

export default function SectionEditor({ section, pageKey, isOpen, onClose, onSave }) {
  const [form, setForm] = useState(() => buildInitialState(section, pageKey));
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(buildInitialState(section, pageKey));
    setActiveTab('basic');
    setErrors({});
  }, [section, pageKey, isOpen]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate() {
    const errs = {};
    if (!form.sectionKey.trim()) errs.sectionKey = 'La cle de section est requise';
    if (!form.contentType) errs.contentType = 'Le type de contenu est requis';
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setActiveTab('basic');
      return;
    }
    onSave?.({ ...form });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
              {section ? 'Modifier la section' : 'Nouvelle section'}
            </p>
            <h3 className="mt-1 font-display text-2xl text-somacan-brand">
              {form.title || form.sectionKey || 'Section'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.key
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'basic' && (
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Type de contenu</label>
                <select
                  value={form.contentType}
                  onChange={(e) => updateField('contentType', e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                >
                  {CONTENT_TYPES.map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
                {errors.contentType && <p className="mt-1 text-xs text-red-600">{errors.contentType}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Titre</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Cle de section</label>
                <input
                  value={form.sectionKey}
                  onChange={(e) => updateField('sectionKey', e.target.value)}
                  placeholder="hero-main, about-intro..."
                  className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                />
                {errors.sectionKey && <p className="mt-1 text-xs text-red-600">{errors.sectionKey}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Ordre</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => updateField('sortOrder', parseInt(e.target.value, 10) || 0)}
                  className="mt-1 h-11 w-32 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => updateField('active', e.target.checked)}
                  id="section-active"
                  className="h-4 w-4 rounded border-stone-300"
                />
                <label htmlFor="section-active" className="text-sm text-stone-700">Actif</label>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <SectionEditorFields
              contentType={form.contentType}
              content={typeof form.content === 'object' ? form.content : {}}
              mode="content"
              onChange={(val) => updateField('content', val)}
            />
          )}

          {activeTab === 'design' && (
            <SectionEditorFields
              contentType={form.contentType}
              content={typeof form.content === 'object' ? form.content : {}}
              mode="design"
              onChange={(val) => updateField('content', val)}
            />
          )}

          {activeTab === 'animation' && (
            <div className="grid gap-5">
              <AnimationPicker
                value={form.animation}
                onChange={(val) => updateField('animation', val)}
                showPreview
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Delai (ms): {form.animationDelay}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={50}
                  value={form.animationDelay}
                  onChange={(e) => updateField('animationDelay', parseInt(e.target.value, 10))}
                  className="mt-2 w-full"
                />
                <div className="mt-1 flex justify-between text-[10px] text-stone-400">
                  <span>0ms</span>
                  <span>500ms</span>
                  <span>1000ms</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="grid gap-4">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  CSS classes du wrapper
                </label>
                <input
                  value={form.cssClasses}
                  onChange={(e) => updateField('cssClasses', e.target.value)}
                  placeholder="ex: relative z-10 overflow-hidden"
                  className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none"
                />
                <p className="mt-2 text-xs leading-5 text-stone-400">
                  Applique des classes Tailwind ou personnalisées au conteneur externe de la section.
                </p>
              </div>

              <SectionEditorFields
                contentType={form.contentType}
                content={typeof form.content === 'object' ? form.content : {}}
                mode="advanced"
                onChange={(val) => updateField('content', val)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-100"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-stone-800"
            >
              {section ? 'Mettre a jour' : 'Creer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
