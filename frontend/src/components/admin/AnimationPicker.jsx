import { useEffect, useRef, useState } from 'react';

const ANIMATION_OPTIONS = [
  { value: 'none', label: 'Aucune' },
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-down', label: 'Fade Down' },
  { value: 'fade-left', label: 'Fade Left' },
  { value: 'fade-right', label: 'Fade Right' },
  { value: 'scale-in', label: 'Scale In' },
  { value: 'scale-out', label: 'Scale Out' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'parallax', label: 'Parallax' },
  { value: 'stagger', label: 'Stagger' },
  { value: 'bounce-in', label: 'Bounce In' },
];

const PREVIEW_KEYFRAMES = {
  'fade-up': { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  'fade-down': { from: { opacity: 0, transform: 'translateY(-24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  'fade-left': { from: { opacity: 0, transform: 'translateX(24px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
  'fade-right': { from: { opacity: 0, transform: 'translateX(-24px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
  'scale-in': { from: { opacity: 0, transform: 'scale(0.8)' }, to: { opacity: 1, transform: 'scale(1)' } },
  'scale-out': { from: { opacity: 0, transform: 'scale(1.2)' }, to: { opacity: 1, transform: 'scale(1)' } },
  'slide-left': { from: { transform: 'translateX(60px)' }, to: { transform: 'translateX(0)' } },
  'slide-right': { from: { transform: 'translateX(-60px)' }, to: { transform: 'translateX(0)' } },
  'slide-up': { from: { transform: 'translateY(60px)' }, to: { transform: 'translateY(0)' } },
  'slide-down': { from: { transform: 'translateY(-60px)' }, to: { transform: 'translateY(0)' } },
  'parallax': { from: { transform: 'translateY(30px) scale(1.05)' }, to: { transform: 'translateY(0) scale(1)' } },
  'stagger': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
  'bounce-in': { from: { opacity: 0, transform: 'scale(0.4)' }, to: { opacity: 1, transform: 'scale(1)' } },
};

function PreviewBox({ animation }) {
  const ref = useRef(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [animation]);

  useEffect(() => {
    const el = ref.current;
    if (!el || animation === 'none') return;

    const frames = PREVIEW_KEYFRAMES[animation];
    if (!frames) return;

    const anim = el.animate([frames.from, frames.to], {
      duration: 600,
      easing: animation === 'bounce-in' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out',
      fill: 'forwards',
    });

    return () => anim.cancel();
  }, [animation, key]);

  return (
    <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
      <div
        key={key}
        ref={ref}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-900 text-xs font-bold text-white"
      >
        A
      </div>
    </div>
  );
}

export default function AnimationPicker({ value, onChange, showPreview = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">Animation</label>
      <select
        value={value || 'none'}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
      >
        {ANIMATION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {showPreview && value && value !== 'none' && <PreviewBox animation={value} />}
    </div>
  );
}
