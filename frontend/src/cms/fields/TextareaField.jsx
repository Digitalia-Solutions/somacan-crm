export default function TextareaField({ label, value, onChange, placeholder, rows = 4, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="border border-stone-200 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition resize-y"
      />
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
