import React from 'react';

const VARIANTS = {
  default: 'bg-stone-100 text-stone-600',
  primary: 'bg-stone-900 text-white',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  outline: 'border border-stone-200 text-stone-600',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${VARIANTS[variant] || VARIANTS.default} ${className}`}>
      {children}
    </span>
  );
}
