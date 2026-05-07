import FieldRenderer from '../FieldRenderer';

export default function RepeaterField({ label, value, onChange, fields = [], hint }) {
  const items = Array.isArray(value) ? value : [];

  function addItem() {
    const blank = fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});
    onChange([...items, blank]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveUp(index) {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index) {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  function updateItem(index, fieldName, fieldValue) {
    const next = items.map((item, i) =>
      i === index ? { ...item, [fieldName]: fieldValue } : item
    );
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-stone-200 rounded-xl bg-stone-50 p-3 flex flex-col gap-3"
          >
            {/* Item header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                #{index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs"
                  title="Monter"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs"
                  title="Descendre"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition text-xs"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sub-fields */}
            {fields.map((subField) => (
              <FieldRenderer
                key={subField.name}
                field={subField}
                value={item[subField.name]}
                onChange={(val) => updateItem(index, subField.name, val)}
              />
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-1 flex items-center justify-center gap-2 border border-dashed border-stone-300 rounded-xl py-2 text-sm text-stone-500 hover:border-[#033a22] hover:text-[#033a22] hover:bg-[#033a22]/5 transition"
      >
        <span className="text-lg leading-none">+</span>
        Ajouter un élément
      </button>

      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
