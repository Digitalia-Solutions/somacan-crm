import { Play, ZapOff } from 'lucide-react';
import SwitchField from './SwitchField';
import { FieldWrapper } from '../FieldRenderer';
import Button from '../../components/ui/Button';

const ANIMATION_TYPES = [
  { value: 'none', label: 'Aucune' },
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-down', label: 'Fade Down' },
  { value: 'fade-left', label: 'Fade Left' },
  { value: 'fade-right', label: 'Fade Right' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'stagger', label: 'Stagger Grid' },
  { value: 'stagger-reveal', label: 'Stagger Reveal' },
  { value: 'split-text', label: 'Split Text' },
  { value: 'magnetic-hover', label: 'Magnetic' },
  { value: 'scroll-velocity', label: 'Velocity Scroll' },
  { value: 'parallax', label: 'Parallax Simple' },
  { value: 'reveal', label: 'Reveal Mask' },
];

const EASING_OPTIONS = [
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In-Out' },
  { value: 'power3.out', label: 'Power3 Out' },
  { value: 'bounce.out', label: 'Bounce' },
  { value: 'expo.out', label: 'Expo Out' },
];

export default function AnimationControlsField({ label, value, onChange, hint, required, error, description }) {
  const anim = value || {
    type: 'none',
    duration: 1000,
    delay: 0,
    easing: 'ease-out',
    stagger: 100,
    triggerOnScroll: true,
  };

  function update(key, val) {
    onChange({ ...anim, [key]: val });
  }

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="grid gap-5 p-5 rounded-2xl border border-stone-200 bg-stone-50/50">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Type d'effet</label>
          <div className="flex gap-2">
            <select
              value={anim.type ?? 'none'}
              onChange={(e) => update('type', e.target.value)}
              className="flex-1 h-11 border border-stone-200 rounded-xl bg-white px-4 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all appearance-none"
            >
              {ANIMATION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {anim.type !== 'none' && (
              <Button size="sm" variant="secondary" icon={Play} onClick={() => {
                // Logic to re-trigger animation in preview could be handled via state in parent
                window.dispatchEvent(new CustomEvent('cms:preview-animation', { detail: { type: anim.type } }));
              }}>
                Tester
              </Button>
            )}
          </div>
        </div>

        {anim.type !== 'none' ? (
          <div className="grid gap-6 pt-4 border-t border-stone-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Durée</label>
                  <span className="text-[10px] font-mono font-bold text-stone-900">{anim.duration ?? 1000}ms</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={100}
                  value={anim.duration ?? 1000}
                  onChange={(e) => update('duration', Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Délai</label>
                  <span className="text-[10px] font-mono font-bold text-stone-900">{anim.delay ?? 0}ms</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={50}
                  value={anim.delay ?? 0}
                  onChange={(e) => update('delay', Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Easing Curve</label>
              <select
                value={anim.easing ?? 'ease-out'}
                onChange={(e) => update('easing', e.target.value)}
                className="h-11 border border-stone-200 rounded-xl bg-white px-4 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all appearance-none"
              >
                {EASING_OPTIONS.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>

            {['stagger', 'stagger-reveal', 'split-text'].includes(anim.type) && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Entre chaque élément (Stagger)</label>
                  <span className="text-[10px] font-mono font-bold text-stone-900">{anim.stagger ?? 100}ms</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  step={20}
                  value={anim.stagger ?? 100}
                  onChange={(e) => update('stagger', Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
               <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Déclencher au scroll</span>
               <SwitchField
                  value={anim.triggerOnScroll ?? true}
                  onChange={(val) => update('triggerOnScroll', val)}
                />
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center border border-dashed border-stone-200 rounded-xl">
             <ZapOff size={24} className="text-stone-200 mb-2" />
             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Aucune animation active</p>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
