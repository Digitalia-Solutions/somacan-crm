import SwitchField from './SwitchField';

const ANIMATION_TYPES = [
  { value: 'none', label: 'Aucune' },
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-down', label: 'Fade Down' },
  { value: 'fade-left', label: 'Fade Left' },
  { value: 'fade-right', label: 'Fade Right' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'stagger', label: 'Stagger' },
  { value: 'stagger-reveal', label: 'Stagger Reveal' },
  { value: 'split-text', label: 'Split Text' },
  { value: 'magnetic-hover', label: 'Magnetic Hover' },
  { value: 'scroll-velocity', label: 'Scroll Velocity' },
  { value: 'parallax', label: 'Parallax' },
  { value: 'parallax-layers', label: 'Parallax Layers' },
  { value: 'horizontal-pin-scroll', label: 'Horizontal Pin Scroll' },
  { value: 'reveal', label: 'Reveal' },
];

const EASING_OPTIONS = [
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In-Out' },
  { value: 'power3.out', label: 'Power3 Out' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'spring', label: 'Spring' },
];

export default function AnimationControlsField({ label, value, onChange }) {
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
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}

      {/* Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-stone-500">Type d'animation</label>
        <select
          value={anim.type ?? 'none'}
          onChange={(e) => update('type', e.target.value)}
          className="border border-stone-200 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
        >
          {ANIMATION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {anim.type !== 'none' && (
        <>
          {/* Duration */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-stone-500">Durée</label>
              <span className="text-xs text-stone-400">{anim.duration ?? 1000}ms</span>
            </div>
            <input
              type="range"
              min={0}
              max={2000}
              step={50}
              value={anim.duration ?? 1000}
              onChange={(e) => update('duration', Number(e.target.value))}
              className="w-full accent-[#033a22]"
            />
          </div>

          {/* Delay */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-stone-500">Délai</label>
              <span className="text-xs text-stone-400">{anim.delay ?? 0}ms</span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={25}
              value={anim.delay ?? 0}
              onChange={(e) => update('delay', Number(e.target.value))}
              className="w-full accent-[#033a22]"
            />
          </div>

          {/* Easing */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-500">Easing</label>
            <select
              value={anim.easing ?? 'ease-out'}
              onChange={(e) => update('easing', e.target.value)}
              className="border border-stone-200 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
            >
              {EASING_OPTIONS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Stagger (only if type=stagger) */}
          {['stagger', 'stagger-reveal', 'split-text'].includes(anim.type) && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-stone-500">Stagger</label>
                <span className="text-xs text-stone-400">{anim.stagger ?? 100}ms</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={anim.stagger ?? 100}
                onChange={(e) => update('stagger', Number(e.target.value))}
                className="w-full accent-[#033a22]"
              />
            </div>
          )}

          {/* Trigger on scroll */}
          <SwitchField
            label="Déclencher au scroll"
            value={anim.triggerOnScroll ?? true}
            onChange={(val) => update('triggerOnScroll', val)}
          />
        </>
      )}
    </div>
  );
}
