import { FieldWrapper } from '../FieldRenderer';

export default function ColorPickerField({ label, value, onChange, hint, required, error, description }) {
  const safeValue = value || '#000000';

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 rounded-xl border border-stone-200 bg-stone-50 p-1 flex-shrink-0">
          <input
            type="color"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
            className="w-full h-full rounded-lg shadow-inner ring-1 ring-black/5"
            style={{ backgroundColor: safeValue }}
          />
        </div>
        <input
          type="text"
          value={safeValue.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          placeholder="#000000"
          className="flex-1 h-11 border border-stone-200 rounded-xl bg-stone-50 px-4 text-sm text-stone-900 font-mono uppercase tracking-widest placeholder:text-stone-300 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
          maxLength={7}
        />
        <button
          type="button"
          onClick={() => onChange('')}
          className="h-11 px-4 rounded-xl border border-stone-200 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all"
        >
          Reset
        </button>
      </div>
    </FieldWrapper>
  );
}
