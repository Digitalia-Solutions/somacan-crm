import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Layers } from 'lucide-react';
import FieldRenderer from '../FieldRenderer';
import { FieldWrapper } from '../FieldRenderer';
import Button from '../../components/ui/Button';

export default function RepeaterField({ label, value, onChange, fields = [], hint, required, error, description }) {
  const items = Array.isArray(value) ? value : [];
  const [expandedIndex, setExpandedIndex] = useState(null);

  function addItem() {
    const blank = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue || '' }), {});
    onChange([...items, blank]);
    setExpandedIndex(items.length);
  }

  function removeItem(index) {
    if (window.confirm('Supprimer cet élément ?')) {
      onChange(items.filter((_, i) => i !== index));
      if (expandedIndex === index) setExpandedIndex(null);
    }
  }

  function moveUp(index) {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
    if (expandedIndex === index) setExpandedIndex(index - 1);
    else if (expandedIndex === index - 1) setExpandedIndex(index);
  }

  function moveDown(index) {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
    if (expandedIndex === index) setExpandedIndex(index + 1);
    else if (expandedIndex === index + 1) setExpandedIndex(index);
  }

  function updateItem(index, fieldName, fieldValue) {
    const next = items.map((item, i) =>
      i === index ? { ...item, [fieldName]: fieldValue } : item
    );
    onChange(next);
  }

  const getItemLabel = (item, index) => {
    // Try to find a good label field (title, name, label, text)
    const labelField = fields.find(f => ['title', 'name', 'label', 'text'].includes(f.name));
    return item[labelField?.name] || `Élément #${index + 1}`;
  };

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const isExpanded = expandedIndex === index;
          
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all ${
                isExpanded ? 'border-stone-900 shadow-xl bg-white' : 'border-stone-200 bg-stone-50 hover:border-stone-300'
              }`}
            >
              {/* Item header */}
              <div 
                className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <div className="text-stone-300">
                   <GripVertical size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${isExpanded ? 'text-stone-900' : 'text-stone-500'}`}>
                    {getItemLabel(item, index)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                    disabled={index === 0}
                    className="p-1.5 text-stone-400 hover:text-stone-900 disabled:opacity-0 transition"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                    disabled={index === items.length - 1}
                    className="p-1.5 text-stone-400 hover:text-stone-900 disabled:opacity-0 transition"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <div className="w-px h-4 bg-stone-200 mx-1" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Sub-fields */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 grid gap-5 border-t border-stone-100">
                  {fields.map((subField) => (
                    <FieldRenderer
                      key={subField.name}
                      field={subField}
                      value={item[subField.name]}
                      onChange={(val) => updateItem(index, subField.name, val)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={addItem}
        icon={Plus}
        className="mt-2 w-full border-dashed border-stone-300 py-3 text-stone-400 hover:text-stone-900 hover:border-stone-900"
      >
        Ajouter un élément
      </Button>
    </FieldWrapper>
  );
}
