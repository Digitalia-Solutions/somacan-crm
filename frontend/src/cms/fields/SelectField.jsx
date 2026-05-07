export default function SelectField({ label, value, onChange, options = [], hint }) {
  // options can be [{ value, label }] or ['string']
  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="border border-stone-200 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
      >
        <option value="">— Sélectionner —</option>
        {normalized.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
