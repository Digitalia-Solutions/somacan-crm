import { GripVertical, Pencil, Trash2 } from 'lucide-react';

const TYPE_COLORS = {
  hero: 'bg-amber-100 text-amber-800',
  section: 'bg-blue-100 text-blue-800',
  faq: 'bg-emerald-100 text-emerald-800',
  stats: 'bg-violet-100 text-violet-800',
  gallery: 'bg-pink-100 text-pink-800',
  form: 'bg-cyan-100 text-cyan-800',
  menu: 'bg-stone-200 text-stone-700',
  theme: 'bg-orange-100 text-orange-800',
  footer: 'bg-stone-200 text-stone-600',
};

export default function SectionCard({ section, onEdit, onDelete, onDragStart, onDragOver, onDrop }) {
  const colorClass = TYPE_COLORS[section.contentType] || 'bg-stone-100 text-stone-600';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, section)}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(e, section); }}
      onDrop={(e) => onDrop?.(e, section)}
      className="group flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md cursor-grab active:cursor-grabbing"
    >
      <span className="flex-shrink-0 text-stone-300 group-hover:text-stone-500">
        <GripVertical size={16} />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-stone-900">
            {section.title || section.sectionKey || 'Sans titre'}
          </span>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
            {section.contentType}
          </span>
        </div>
        {section.sectionKey && section.title && (
          <p className="mt-0.5 text-xs text-stone-400 truncate">{section.sectionKey}</p>
        )}
      </div>

      <span className="flex-shrink-0 text-xs text-stone-400 tabular-nums">
        #{section.sortOrder ?? 0}
      </span>

      <div className="flex-shrink-0 flex items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit?.(section.id)}
          className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          title="Modifier"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(section.id)}
          className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
