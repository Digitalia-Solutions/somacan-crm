import React from 'react';
import { FieldWrapper } from '../FieldRenderer';

export default function SwitchField({ label, value, onChange, hint, error }) {
  return (
    <FieldWrapper label={null} hint={hint} error={error}>
      <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200 shadow-sm">
        {label && (
          <span className="text-sm font-bold text-stone-700">{label}</span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-stone-900/10 ${
            value ? 'bg-stone-900' : 'bg-stone-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-200 ${
              value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </FieldWrapper>
  );
}
