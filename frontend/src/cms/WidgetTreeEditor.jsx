import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown, Settings2, Layout,
  Zap, Monitor, MoreVertical, Eye, EyeOff, GripVertical, Layers,
  Type, Image as ImageIcon, PlayCircle, Square, Divide, Star,
  HelpCircle, MousePointer2, Box, Search, X
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove, sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createWidgetNode, WIDGET_TYPES } from '../../../shared/cms/widgets.js';
import { getSectionDefinition } from '../../../shared/cms/sections.js';
import { getWidgetDef } from './v2/WidgetRegistry.jsx';
import FieldRenderer from './FieldRenderer';
import ResponsiveField from './fields/ResponsiveField';
import AnimationControlsField from './fields/AnimationControlsField';
import StylePresetField from './fields/StylePresetField';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { AnimatePresence, motion } from 'framer-motion';

// --- Widget Icon Helper ---
function getWidgetIcon(type) {
  const icons = {
    HeadingWidget: <Type size={16} />,
    ParagraphWidget: <Type size={16} className="opacity-50" />,
    ButtonWidget: <MousePointer2 size={16} />,
    ImageWidget: <ImageIcon size={16} />,
    VideoWidget: <PlayCircle size={16} />,
    ProductCardWidget: <Star size={16} />,
    CategoryCardWidget: <Layers size={16} />,
    SpacerWidget: <Square size={16} className="opacity-30" />,
    DividerWidget: <Divide size={16} />,
    IconWidget: <Box size={16} />,
    TestimonialWidget: <Star size={16} className="fill-current" />,
    FAQWidget: <HelpCircle size={16} />,
  };
  return icons[type] || <Box size={16} />;
}

function getAllowedWidgetTypes(sectionType) {
  const definition = getSectionDefinition(sectionType);
  if (!definition || definition.allowedWidgets === '*') {
    return WIDGET_TYPES;
  }
  return definition.allowedWidgets || [];
}

// ─── Sortable Widget Item ────────────────────────────────────────────────────

function SortableWidgetItem({ widget, index, total, isActive, onSelect, onMove, onDuplicate, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
  const definition = getWidgetDef(widget.type);
  const isHidden = widget.responsive?.desktop?.visible === false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-widget-id={widget.id}
      onClick={() => onSelect(widget.id)}
      className={`group relative flex items-center gap-2 rounded-2xl border p-3 transition-all cursor-pointer ${
        isDragging ? 'shadow-xl ring-2 ring-stone-900/10 z-50 bg-white' :
        isActive ? 'border-stone-900 bg-white shadow-xl ring-1 ring-stone-900/5 z-10' :
        'border-stone-100 bg-white/40 hover:border-stone-300 hover:bg-white'
      } ${isHidden ? 'opacity-40 grayscale' : ''}`}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={e => e.stopPropagation()}
        className="shrink-0 p-1 text-stone-200 hover:text-stone-500 cursor-grab active:cursor-grabbing touch-none transition-colors"
        title="Glisser pour réordonner"
      >
        <GripVertical size={14} />
      </button>

      <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
        isActive ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-400 group-hover:bg-stone-100'
      }`}>
        {getWidgetIcon(widget.type)}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-bold uppercase tracking-widest truncate ${isActive ? 'text-stone-900' : 'text-stone-500'}`}>
          {definition?.label || widget.type.replace('Widget', '')}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[9px] text-stone-300 font-mono">#{index + 1}</span>
          {isHidden && <span className="text-[8px] font-bold text-red-400">Masqué</span>}
        </div>
      </div>

      <div className={`flex items-center gap-0.5 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} onClick={e => e.stopPropagation()}>
        <button type="button" onClick={() => onMove(widget.id, 'up')} disabled={index === 0}
          className="p-1 text-stone-300 hover:text-stone-900 disabled:opacity-0 transition" title="Monter">
          <ChevronUp size={12} />
        </button>
        <button type="button" onClick={() => onMove(widget.id, 'down')} disabled={index === total - 1}
          className="p-1 text-stone-300 hover:text-stone-900 disabled:opacity-0 transition" title="Descendre">
          <ChevronDown size={12} />
        </button>
        <button type="button" onClick={() => onDuplicate(widget)}
          className="p-1 text-stone-300 hover:text-blue-500 transition" title="Dupliquer">
          <Copy size={12} />
        </button>
        <button type="button" onClick={() => onRemove(widget.id)}
          className="p-1 text-stone-300 hover:text-red-500 transition" title="Supprimer">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function WidgetSortableList({ widgets, activeWidgetId, listRef, onSelect, onReorder, onMove, onDuplicate, onRemove, onAdd }) {
  const [dndActiveId, setDndActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const activeWidget = widgets.find(w => w.id === dndActiveId);

  function handleDragEnd({ active, over }) {
    setDndActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIdx = widgets.findIndex(w => w.id === active.id);
    const newIdx = widgets.findIndex(w => w.id === over.id);
    onReorder(arrayMove([...widgets], oldIdx, newIdx));
  }

  if (!widgets.length) {
    return (
      <div onClick={onAdd} className="py-12 text-center rounded-[1.5rem] border-2 border-dashed border-stone-200 bg-white/40 cursor-pointer hover:bg-white/60 transition-colors">
        <Plus size={24} className="mx-auto text-stone-300 mb-2" />
        <p className="text-xs font-bold text-stone-400">Ajouter un widget</p>
      </div>
    );
  }

  const dropAnimation = { duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={({ active }) => setDndActiveId(active.id)} onDragEnd={handleDragEnd} onDragCancel={() => setDndActiveId(null)}>
      <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
        <div ref={listRef} className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1 scrollbar-hide">
          {widgets.map((widget, index) => (
            <SortableWidgetItem
              key={widget.id}
              widget={widget}
              index={index}
              total={widgets.length}
              isActive={activeWidgetId === widget.id}
              onSelect={onSelect}
              onMove={onMove}
              onDuplicate={onDuplicate}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeWidget ? (
          <div className="flex items-center gap-2 rounded-2xl border-2 border-stone-900 p-3 bg-white shadow-2xl opacity-95 cursor-grabbing">
            <GripVertical size={14} className="text-stone-400 shrink-0" />
            <div className="h-8 w-8 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
              {getWidgetIcon(activeWidget.type)}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-900">
              {getWidgetDef(activeWidget.type)?.label || activeWidget.type}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Main WidgetTreeEditor ────────────────────────────────────────────────────

export default function WidgetTreeEditor({ sectionType, value, onChange }) {
  const widgets = Array.isArray(value) ? value : [];
  const allowedTypes = useMemo(() => getAllowedWidgetTypes(sectionType), [sectionType]);
  const [activeWidgetId, setActiveWidgetId] = useState(widgets[0]?.id || null);
  const [editTab, setEditTab] = useState('content'); // content, style, animation, responsive, advanced
  const [showAddModal, setShowAddModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const listRef = useRef(null);

  const activeWidget = widgets.find((widget) => widget.id === activeWidgetId) || null;

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('cms:save'));
      }
      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('cms:close'));
      }
      if (!activeWidgetId) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          removeWidget(activeWidgetId);
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        if (activeWidget) duplicateWidget(activeWidget);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const idx = widgets.findIndex(w => w.id === activeWidgetId);
        if (idx > 0) setActiveWidgetId(widgets[idx - 1].id);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const idx = widgets.findIndex(w => w.id === activeWidgetId);
        if (idx < widgets.length - 1) setActiveWidgetId(widgets[idx + 1].id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeWidgetId, activeWidget, widgets]);

  // Scroll active widget into view
  useEffect(() => {
    if (!listRef.current || !activeWidgetId) return;
    const el = listRef.current.querySelector(`[data-widget-id="${activeWidgetId}"]`);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeWidgetId]);

  function updateWidget(widgetId, updater) {
    onChange(
      widgets.map((widget) => (widget.id === widgetId ? updater(widget) : widget)),
    );
  }

  function addWidget(type) {
    const widget = createWidgetNode(type);
    if (!widget) return;
    onChange([...widgets, widget]);
    setActiveWidgetId(widget.id);
    setShowAddModal(false);
  }

  function removeWidget(widgetId) {
    if (!window.confirm('Supprimer ce widget ?')) return;
    const next = widgets.filter((widget) => widget.id !== widgetId);
    onChange(next);
    if (activeWidgetId === widgetId) {
      setActiveWidgetId(next[0]?.id || null);
    }
  }

  function duplicateWidget(widget) {
    const duplicated = {
      ...widget,
      id: `${widget.type}-${Math.random().toString(36).slice(2, 10)}`,
    };
    const idx = widgets.findIndex((w) => w.id === widget.id);
    const next = [...widgets];
    next.splice(idx + 1, 0, duplicated);
    onChange(next);
    setActiveWidgetId(duplicated.id);
  }

  function moveWidget(widgetId, direction) {
    const idx = widgets.findIndex((w) => w.id === widgetId);
    if (idx === -1) return;
    
    let newIdx = idx;
    if (direction === 'up' && idx > 0) newIdx = idx - 1;
    else if (direction === 'down' && idx < widgets.length - 1) newIdx = idx + 1;
    else return;

    const next = [...widgets];
    const [moved] = next.splice(idx, 1);
    next.splice(newIdx, 0, moved);
    onChange(next);
  }

  const widgetScope = useMemo(() => {
    if (!activeWidget) return 'typography';
    if (activeWidget.type.includes('Button')) return 'button';
    if (activeWidget.type.includes('Card') || activeWidget.type.includes('Testimonial')) return 'card';
    return 'typography';
  }, [activeWidget]);

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] min-h-0">
      {/* Widget List Sidebar */}
      <div className="flex flex-col gap-4">
        <div className="rounded-[2rem] border border-stone-200 bg-stone-50 p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCollapsed(c => !c)}
                className="p-1 text-stone-300 hover:text-stone-600 transition-colors"
                title={collapsed ? 'Déplier' : 'Replier'}
              >
                {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Arborescence</h3>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="h-8 w-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              <Plus size={16} />
            </button>
          </div>

          {!collapsed && (
          <WidgetSortableList
            widgets={widgets}
            activeWidgetId={activeWidgetId}
            listRef={listRef}
            onSelect={setActiveWidgetId}
            onReorder={(reordered) => onChange(reordered)}
            onMove={moveWidget}
            onDuplicate={duplicateWidget}
            onRemove={removeWidget}
            onAdd={() => setShowAddModal(true)}
          />
          )}
        </div>
      </div>

      {/* Widget Edit Pane */}
      <div className="flex flex-col rounded-[2.2rem] border border-stone-200 bg-white overflow-hidden shadow-sm min-h-0">
        {!activeWidget ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="h-20 w-20 rounded-full bg-stone-50 flex items-center justify-center text-stone-200 mb-6">
              <Box size={40} />
            </div>
            <h4 className="text-xl font-display text-stone-400">Propriétés du Widget</h4>
            <p className="text-sm text-stone-400 mt-2 max-w-[240px] mx-auto">
              Sélectionnez un bloc dans l'arborescence pour modifier ses réglages.
            </p>
          </div>
        ) : (
          <>
            {/* Header Tabs */}
            <div className="flex border-b border-stone-100 bg-stone-50/30">
              {[
                { id: 'content', label: 'Contenu', icon: Layout },
                { id: 'style', label: 'Style', icon: Settings2 },
                { id: 'animation', label: 'Animation', icon: Zap },
                { id: 'responsive', label: 'Responsive', icon: Monitor },
                { id: 'advanced', label: 'Avancé', icon: MoreVertical },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEditTab(id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 transition-all relative ${
                    editTab === id
                      ? 'text-stone-900'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  {editTab === id && (
                    <motion.div 
                      layoutId="activeTabWidget"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-stone-100">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-stone-50 text-stone-400 flex items-center justify-center border border-stone-100">
                    {getWidgetIcon(activeWidget.type)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-display text-somacan-brand leading-none">
                      {getWidgetDef(activeWidget.type)?.label || activeWidget.type}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] font-mono">
                         ID: {activeWidget.id}
                       </span>
                       <div className="w-1 h-1 rounded-full bg-stone-200" />
                       <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Élément Actif</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] text-stone-300">↑↓ naviguer · ⌘D dupliquer · ⌘⌫ supprimer</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => duplicateWidget(activeWidget)} icon={Copy} className="rounded-xl">Dupliquer</Button>
                  <Button variant="danger" size="sm" onClick={() => removeWidget(activeWidget.id)} icon={Trash2} className="rounded-xl">Supprimer</Button>
                </div>
              </div>

              <div className="space-y-8 max-w-2xl">
                {editTab === 'content' && (
                  <div className="grid gap-6">
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
                    {!(getWidgetDef(activeWidget.type)?.fields?.length) && (
                      <div className="py-12 text-center rounded-2xl border-2 border-dashed border-stone-100">
                        <p className="text-sm text-stone-400">Ce widget n'a pas de réglages de contenu.</p>
                      </div>
                    )}
                  </div>
                )}

                {editTab === 'style' && (
                  <div className="grid gap-8">
                    <StylePresetField
                      scope={widgetScope}
                      label="Style Prédéfini"
                      value={activeWidget.style?.presetId || activeWidget.props?.variant}
                      onChange={(presetId) => updateWidget(activeWidget.id, (widget) => ({
                        ...widget,
                        style: {
                          ...(widget.style || {}),
                          presetId,
                        },
                      }))}
                    />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Overrides de Style (JSON)</label>
                        <Badge variant="outline" className="font-mono text-[8px]">CSS Props</Badge>
                      </div>
                      <textarea
                        value={JSON.stringify(activeWidget.style?.styles || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const styles = JSON.parse(e.target.value);
                            updateWidget(activeWidget.id, (widget) => ({
                              ...widget,
                              style: { ...(widget.style || {}), styles },
                            }));
                          } catch (err) {}
                        }}
                        className="w-full h-40 bg-stone-950 text-emerald-400 font-mono text-[11px] p-5 rounded-2xl focus:outline-none ring-1 ring-white/10 shadow-inner"
                        placeholder='{ "color": "#000" }'
                      />
                    </div>
                  </div>
                )}

                {editTab === 'animation' && (
                  <AnimationControlsField
                    label="Configuration de l'animation"
                    value={activeWidget.animation}
                    onChange={(fieldValue) => updateWidget(activeWidget.id, (widget) => ({
                      ...widget,
                      animation: fieldValue,
                    }))}
                  />
                )}

                {editTab === 'responsive' && (
                  <ResponsiveField
                    label="Visibilité & Espacement par appareil"
                    value={activeWidget.responsive}
                    onChange={(fieldValue) => updateWidget(activeWidget.id, (widget) => ({
                      ...widget,
                      responsive: fieldValue,
                    }))}
                  />
                )}

                {editTab === 'advanced' && (
                  <div className="grid gap-6">
                    <FieldRenderer 
                      field={{ name: 'customId', label: 'ID CSS Personnalisé', type: 'text', placeholder: 'ex: my-unique-widget' }}
                      value={activeWidget.advanced?.customId}
                      onChange={(val) => updateWidget(activeWidget.id, w => ({ ...w, advanced: { ...w.advanced, customId: val }}))}
                    />
                    <FieldRenderer 
                      field={{ name: 'customClass', label: 'Classes CSS Additionnelles', type: 'text', placeholder: 'ex: mt-10 shadow-luxury' }}
                      value={activeWidget.advanced?.customClass}
                      onChange={(val) => updateWidget(activeWidget.id, w => ({ ...w, advanced: { ...w.advanced, customClass: val }}))}
                    />
                    <FieldRenderer 
                      field={{ name: 'zIndex', label: 'Z-Index', type: 'text', placeholder: '10' }}
                      value={activeWidget.advanced?.zIndex}
                      onChange={(val) => updateWidget(activeWidget.id, w => ({ ...w, advanced: { ...w.advanced, zIndex: val }}))}
                    />
                    <FieldRenderer 
                      field={{ name: 'ariaLabel', label: 'Label Accessibilité (Aria)', type: 'text' }}
                      value={activeWidget.advanced?.ariaLabel}
                      onChange={(val) => updateWidget(activeWidget.id, w => ({ ...w, advanced: { ...w.advanced, ariaLabel: val }}))}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Widget Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] bg-stone-950/40 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 pb-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-display text-somacan-brand">Insérer un Bloc</h3>
                  <p className="text-sm text-stone-400 mt-1">Sélectionnez le type de widget à ajouter à votre section.</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="h-10 w-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 sm:grid-cols-3 gap-3 scrollbar-hide">
                {allowedTypes.map((type) => {
                  const definition = getWidgetDef(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addWidget(type)}
                      className="group flex flex-col items-center justify-center p-6 rounded-[1.8rem] border border-stone-100 bg-white hover:border-stone-900 hover:shadow-xl transition-all gap-4 text-center"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-stone-50 text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all flex items-center justify-center">
                        {getWidgetIcon(type)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900 leading-tight">
                          {definition?.label || type}
                        </p>
                        <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">
                          {type.replace('Widget', '')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
