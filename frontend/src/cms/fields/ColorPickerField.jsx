export default function ColorPickerField({ label, value, onChange, hint }) {
  const safeValue = value || '#000000';

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5 bg-stone-50"
            title="Choisir une couleur"
          />
        </div>
        <input
          type="text"
          value={safeValue}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          placeholder="#000000"
          className="flex-1 border border-stone-200 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-800 font-mono placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          maxLength={7}
        />
        <div
          className="w-10 h-10 rounded-lg border border-stone-200 flex-shrink-0"
          style={{ backgroundColor: safeValue }}
          title="Aperçu"
        />
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
