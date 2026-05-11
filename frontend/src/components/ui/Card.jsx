import React from 'react';

export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[2rem] border border-stone-200 bg-white shadow-[0_12px_40px_rgba(28,25,23,0.03)] transition-all duration-300 ${className} ${onClick ? 'cursor-pointer hover:shadow-[0_20px_60px_rgba(28,25,23,0.06)] active:scale-[0.99]' : ''}`}
    >
      {children}
    </div>
  );
}
