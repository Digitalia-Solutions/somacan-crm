import React from 'react';
import { FieldWrapper } from '../FieldRenderer';
import { ChevronDown } from 'lucide-react';

export default function SelectField({ label, value, onChange, options = [], hint, required, error }) {
  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error}>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 appearance-none border border-stone-200 rounded-2xl bg-stone-50 px-4 pr-10 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-sm"
        >
          <option value="">— Choisir —</option>
          {normalized.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
          <ChevronDown size={16} />
        </div>
      </div>
    </FieldWrapper>
  );
}
