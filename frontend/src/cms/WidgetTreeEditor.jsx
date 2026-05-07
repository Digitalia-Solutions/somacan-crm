import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { createWidgetNode, WIDGET_TYPES } from '../../../shared/cms/widgets.js';
import { getSectionDefinition } from '../../../shared/cms/sections.js';
import { getWidgetDef } from './v2/WidgetRegistry.jsx';
import FieldRenderer from './FieldRenderer';
import ResponsiveField from './fields/ResponsiveField';
import AnimationControlsField from './fields/AnimationControlsField';

function getAllowedWidgetTypes(sectionType) {
  const definition = getSectionDefinition(sectionType);
  if (!definition || definition.allowedWidgets === '*') {
    return WIDGET_TYPES;
  }
  return definition.allowedWidgets || [];
}

export default function WidgetTreeEditor({ sectionType, value, onChange }) {
  const widgets = Array.isArray(value) ? value : [];
  const allowedTypes = useMemo(() => getAllowedWidgetTypes(sectionType), [sectionType]);
  const [activeWidgetId, setActiveWidgetId] = useState(widgets[0]?.id || null);

  const activeWidget = widgets.find((widget) => widget.id === activeWidgetId) || widgets[0] || null;

  function updateWidget(widgetId, updater) {
    onChange(
      widgets.map((widget) => (widget.id === widgetId ? updater(widget) : widget)),
    );
  }

  function addWidget(type) {
    const widget = createWidgetNode(type);
    if (!widget) {
      return;
    }

    onChange([...widgets, widget]);
    setActiveWidgetId(widget.id);
  }

  function removeWidget(widgetId) {
    const next = widgets.filter((widget) => widget.id !== widgetId);
    onChange(next);
    if (activeWidgetId === widgetId) {
      setActiveWidgetId(next[0]?.id || null);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Widgets</p>
          <div className="grid gap-2">
            {widgets.map((widget, index) => {
              const definition = getWidgetDef(widget.type);
              return (
                <button
                  key={widget.id}
                  type="button"
                  onClick={() => setActiveWidgetId(widget.id)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    activeWidget?.id === widget.id
                      ? 'border-[#033a22] bg-white'
                      : 'border-stone-200 bg-white/70 hover:border-stone-300'
                  }`}
                >
                  <p className="text-sm font-semibold text-stone-900">{definition?.label || widget.type}</p>
                  <p className="text-xs text-stone-500">#{index + 1}</p>
                </button>
              );
            })}
            {!widgets.length ? (
              <p className="rounded-xl border border-dashed border-stone-300 px-3 py-4 text-sm text-stone-400">
                No widgets in this section yet.
              </p>
            ) : null}
          </div>
        </div>

        <div className="border-t border-stone-200 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Add widget</p>
          <div className="grid gap-2">
            {allowedTypes.map((type) => {
              const definition = getWidgetDef(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => addWidget(type)}
                  className="inline-flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 text-left text-sm text-stone-700 hover:border-stone-300"
                >
                  <span>{definition?.label || type}</span>
                  <Plus size={14} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white">
        {!activeWidget ? (
          <div className="px-4 py-6 text-sm text-stone-400">Select or add a widget to edit its settings.</div>
        ) : (
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h4 className="text-sm font-semibold text-stone-900">{getWidgetDef(activeWidget.type)?.label || activeWidget.type}</h4>
                <p className="text-xs text-stone-500">{activeWidget.type}</p>
              </div>
              <button
                type="button"
                onClick={() => removeWidget(activeWidget.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>

            {(getWidgetDef(activeWidget.type)?.fields || []).map((field) => (
              <FieldRenderer
                key={`${activeWidget.id}-${field.name}`}
                field={field}
                value={activeWidget.props?.[field.name]}
                onChange={(fieldValue) => updateWidget(activeWidget.id, (widget) => ({
                  ...widget,
                  props: {
                    ...(widget.props || {}),
                    [field.name]: fieldValue,
                  },
                }))}
              />
            ))}

            <div className="border-t border-stone-100 pt-4">
              <FieldRenderer
                field={{ name: 'presetId', label: 'Style preset', type: 'text', placeholder: 'button-primary / card-soft' }}
                value={activeWidget.style?.presetId || ''}
                onChange={(fieldValue) => updateWidget(activeWidget.id, (widget) => ({
                  ...widget,
                  style: {
                    ...(widget.style || {}),
                    presetId: fieldValue || null,
                  },
                }))}
              />
            </div>

            <div className="border-t border-stone-100 pt-4">
              <ResponsiveField
                label="Responsive settings"
                value={activeWidget.responsive}
                onChange={(fieldValue) => updateWidget(activeWidget.id, (widget) => ({
                  ...widget,
                  responsive: fieldValue,
                }))}
              />
            </div>

            <div className="border-t border-stone-100 pt-4">
              <AnimationControlsField
                label="Animation"
                value={activeWidget.animation}
                onChange={(fieldValue) => updateWidget(activeWidget.id, (widget) => ({
                  ...widget,
                  animation: fieldValue,
                }))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
