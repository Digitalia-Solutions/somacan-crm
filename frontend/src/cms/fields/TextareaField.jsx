import React from 'react';
import { FieldWrapper } from '../FieldRenderer';

export default function TextareaField({ label, value, onChange, placeholder, rows = 4, hint, required, error }) {
  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error}>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-stone-200 rounded-2xl bg-stone-50 p-4 text-sm font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all resize-y shadow-sm"
      />
    </FieldWrapper>
  );
}
