import React from 'react';
import { FieldWrapper } from '../FieldRenderer';

export default function TextField({ label, value, onChange, placeholder, required, hint, error }) {
  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error}>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full h-12 border border-stone-200 rounded-2xl bg-stone-50 px-4 text-sm font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-sm"
      />
    </FieldWrapper>
  );
}
