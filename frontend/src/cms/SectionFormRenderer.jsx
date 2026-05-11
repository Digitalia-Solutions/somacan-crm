import { useState, useMemo } from 'react';
import { Layout, Palette, Zap, Monitor, Settings2 } from 'lucide-react';
import { getSectionDef, sectionSupportsWidgets } from './SectionRegistry';
import FieldRenderer from './FieldRenderer';
import AnimationControlsField from './fields/AnimationControlsField';
import ResponsiveField from './fields/ResponsiveField';
import WidgetTreeEditor from './WidgetTreeEditor';
import StylePresetField from './fields/StylePresetField';

/**
 * SectionFormRenderer — renders a 3-tab form for a given section type.
 */
export default function SectionFormRenderer({
  type,
  content,
  settings,
  animation,
  responsive,
  widgetTree,
  onContentChange,
  onSettingsChange,
  onAnimationChange,
  onResponsiveChange,
  onWidgetTreeChange,
}) {
  const [tab, setTab] = useState('content');
  const def = getSectionDef(type);
  const hasWidgets = sectionSupportsWidgets(type);

  const TABS = [
    { key: 'content', label: 'Contenu', Icon: Layout },
    { key: 'style', label: 'Style', Icon: Palette },
    { key: 'animation', label: 'Anim', Icon: Zap },
    { key: 'responsive', label: 'Écrans', Icon: Monitor },
    { key: 'advanced', label: 'Avancé', Icon: Settings2 },
  ];

  function handleContentFieldChange(name, value) {
    onContentChange({ ...content, [name]: value });
  }
  function handleSettingsFieldChange(name, value) {
    onSettingsChange({ ...settings, [name]: value });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section identity bar */}
      <div className="px-6 pt-4 pb-0">
        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400 bg-stone-50 border border-stone-100 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          {type}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-stone-200 bg-white sticky top-0 z-10 scrollbar-hide overflow-x-auto mt-3">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center gap-1 px-3 py-3 text-[9px] font-bold uppercase tracking-[0.15em] transition-all border-b-2 -mb-px whitespace-nowrap ${
              tab === key
                ? 'border-stone-900 text-stone-900 bg-stone-50/50'
                : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50/30'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide p-6 pb-20">
        {/* ── Content tab ── */}
        {tab === 'content' && (
          <div className="grid gap-8">
            {hasWidgets && (
              <div className="mb-4">
                 <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Structure des Widgets</p>
                 <WidgetTreeEditor
                    sectionType={type}
                    value={widgetTree}
                    onChange={onWidgetTreeChange}
                  />
              </div>
            )}

            {def.fields.length > 0 && (
              <div className="grid gap-6">
                {def.fields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    value={content?.[field.name]}
                    onChange={(value) => handleContentFieldChange(field.name, value)}
                  />
                ))}
              </div>
            )}

            {!hasWidgets && def.fields.length === 0 && (
              <div className="py-16 text-center rounded-[2rem] border-2 border-dashed border-stone-100 bg-stone-50/30">
                <Layout size={32} className="mx-auto text-stone-200 mb-3" />
                <p className="text-sm font-bold text-stone-400">Aucun champ de contenu</p>
                <p className="text-[11px] text-stone-300 mt-1">Cette section est gérée via le Style ou les Widgets.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Style tab ── */}
        {tab === 'style' && (
          <div className="grid gap-8">
            <StylePresetField
              scope="section"
              label="Preset de style global"
              value={settings?.presetId}
              onChange={(presetId) => handleSettingsFieldChange('presetId', presetId)}
            />

            {def.settingsFields.length > 0 && (
              <div className="grid gap-5 pt-6 border-t border-stone-100">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Réglages Design</p>
                {def.settingsFields.map((field) => (
                  <FieldRenderer
                    key={field.name}
                    field={field}
                    value={settings?.[field.name]}
                    onChange={(value) => handleSettingsFieldChange(field.name, value)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Animation tab ── */}
        {tab === 'animation' && (
          <div className="grid gap-6">
            <AnimationControlsField
              label="Animation d'entrée"
              value={animation}
              onChange={onAnimationChange}
            />
          </div>
        )}

        {/* ── Responsive tab ── */}
        {tab === 'responsive' && (
          <div className="grid gap-6">
            <ResponsiveField
              label="Visibilité & Espacement par appareil"
              value={responsive}
              onChange={onResponsiveChange}
            />
          </div>
        )}

        {/* ── Advanced tab ── */}
        {tab === 'advanced' && (
          <div className="grid gap-8">
             <div className="grid gap-5">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Identifiants & CSS</p>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">ID Personnalisé</label>
                    <input 
                      type="text" 
                      value={settings?.customId || ''} 
                      onChange={(e) => handleSettingsFieldChange('customId', e.target.value)}
                      placeholder="ma-section-unique"
                      className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500">Classes CSS Supplémentaires</label>
                    <input 
                      type="text" 
                      value={settings?.customClass || ''} 
                      onChange={(e) => handleSettingsFieldChange('customClass', e.target.value)}
                      placeholder="mt-20 overflow-visible..."
                      className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
                    />
                  </div>
                </div>
             </div>

             <div className="pt-6 border-t border-stone-100">
               <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Overrides de style directs (JSON)</p>
               <textarea
                 value={JSON.stringify(settings?.styles || {}, null, 2)}
                 onChange={(e) => {
                   try {
                     const styles = JSON.parse(e.target.value);
                     handleSettingsFieldChange('styles', styles);
                   } catch (err) {}
                 }}
                 className="w-full h-48 bg-stone-950 text-emerald-400 font-mono text-[11px] p-4 rounded-2xl focus:outline-none ring-1 ring-white/5 shadow-inner"
                 placeholder={'{ "paddingTop": "100px" }'}
               />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
