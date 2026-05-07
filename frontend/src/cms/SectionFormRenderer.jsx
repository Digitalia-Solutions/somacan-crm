import { useState } from 'react';
import { getSectionDef, sectionSupportsWidgets } from './SectionRegistry';
import FieldRenderer from './FieldRenderer';
import AnimationControlsField from './fields/AnimationControlsField';
import ResponsiveField from './fields/ResponsiveField';
import WidgetTreeEditor from './WidgetTreeEditor';

/**
 * SectionFormRenderer — renders a 3-tab form for a given section type.
 *
 * Props:
 *   type               — section type key (e.g. 'Hero')
 *   content            — current content object
 *   settings           — current settings object
 *   animation          — current animation object
 *   responsive         — current responsive object
 *   onContentChange    — (newContent) => void
 *   onSettingsChange   — (newSettings) => void
 *   onAnimationChange  — (newAnimation) => void
 *   onResponsiveChange — (newResponsive) => void
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
  const tabs = [
    ...(hasWidgets ? [{ key: 'widgets', label: 'Widgets' }] : []),
    { key: 'content', label: 'Contenu' },
    { key: 'apparence', label: 'Apparence' },
    { key: 'animation', label: 'Animation' },
  ];

  if (!def) {
    return (
      <p className="text-sm text-red-500 px-4 py-3">
        Type de section inconnu: <strong>{type}</strong>
      </p>
    );
  }

  function handleContentFieldChange(fieldName, value) {
    onContentChange({ ...content, [fieldName]: value });
  }

  function handleSettingsFieldChange(fieldName, value) {
    onSettingsChange({ ...settings, [fieldName]: value });
  }

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-stone-200 bg-white sticky top-0 z-10">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              tab === key
                ? 'border-[#033a22] text-[#033a22]'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 flex flex-col gap-4">
        {/* ── Content tab ── */}
        {tab === 'widgets' && hasWidgets && (
          <WidgetTreeEditor
            sectionType={type}
            value={widgetTree}
            onChange={onWidgetTreeChange}
          />
        )}

        {/* ── Content tab ── */}
        {tab === 'content' && (
          <>
            {def.fields.length === 0 ? (
              <p className="text-sm text-stone-400">Aucun champ de contenu pour ce type de section.</p>
            ) : (
              def.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={content?.[field.name]}
                  onChange={(value) => handleContentFieldChange(field.name, value)}
                />
              ))
            )}
          </>
        )}

        {/* ── Apparence tab ── */}
        {tab === 'apparence' && (
          <>
            {def.settingsFields.length === 0 ? (
              <p className="text-sm text-stone-400 mb-2">Aucun réglage d'apparence spécifique.</p>
            ) : (
              def.settingsFields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={settings?.[field.name]}
                  onChange={(value) => handleSettingsFieldChange(field.name, value)}
                />
              ))
            )}

            {/* Responsive settings always shown */}
            <div className="border-t border-stone-100 pt-4">
              <ResponsiveField
                label="Paramètres responsives"
                value={responsive}
                onChange={onResponsiveChange}
              />
            </div>
          </>
        )}

        {/* ── Animation tab ── */}
        {tab === 'animation' && (
          <AnimationControlsField
            label="Paramètres d'animation"
            value={animation}
            onChange={onAnimationChange}
          />
        )}
      </div>
    </div>
  );
}
