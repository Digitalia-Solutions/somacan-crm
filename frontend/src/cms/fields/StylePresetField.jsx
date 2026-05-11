import React from 'react';
import { getBuiltInPresets } from '../v2/GlobalStyleEngine';
import { FieldWrapper } from '../FieldRenderer';

export default function StylePresetField({ scope, label, value, onChange, hint, required, error, description }) {
  const presets = getBuiltInPresets(scope);

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
            !value
              ? 'bg-stone-900 text-white border-stone-900 shadow-lg'
              : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600'
          }`}
        >
          Par défaut
        </button>
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all text-left ${
              value === preset.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-lg'
                : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
           <p className="text-[9px] text-stone-400 font-mono tracking-tighter uppercase">Preset ID: {value}</p>
        </div>
      )}
    </FieldWrapper>
  );
}
