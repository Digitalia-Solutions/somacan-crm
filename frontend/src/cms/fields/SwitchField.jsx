export default function SwitchField({ label, value, onChange, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        {label && (
          <span className="text-sm font-medium text-stone-700">{label}</span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 ${
            value ? 'bg-[#033a22]' : 'bg-stone-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
              value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
