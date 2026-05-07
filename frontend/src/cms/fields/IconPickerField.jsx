import {
  Leaf,
  FlaskConical,
  Sparkles,
  ShieldCheck,
  Star,
  Heart,
  Check,
  ArrowRight,
  Globe,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';

const ICONS = [
  { key: 'leaf', label: 'Leaf', Icon: Leaf },
  { key: 'flask', label: 'Flask', Icon: FlaskConical },
  { key: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { key: 'shield', label: 'Shield', Icon: ShieldCheck },
  { key: 'star', label: 'Star', Icon: Star },
  { key: 'heart', label: 'Heart', Icon: Heart },
  { key: 'check', label: 'Check', Icon: Check },
  { key: 'arrow', label: 'Arrow', Icon: ArrowRight },
  { key: 'globe', label: 'Globe', Icon: Globe },
  { key: 'zap', label: 'Zap', Icon: Zap },
  { key: 'sun', label: 'Sun', Icon: Sun },
  { key: 'moon', label: 'Moon', Icon: Moon },
];

export default function IconPickerField({ label, value, onChange, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}
      <div className="grid grid-cols-6 gap-1.5 p-2 border border-stone-200 rounded-xl bg-stone-50">
        {ICONS.map(({ key, label: iconLabel, Icon }) => {
          const isActive = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={iconLabel}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs transition ${
                isActive
                  ? 'bg-[#033a22] text-white ring-2 ring-[#033a22] ring-offset-1'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-[#033a22] hover:text-[#033a22]'
              }`}
            >
              <Icon size={16} />
              <span className="text-[10px] leading-none">{iconLabel}</span>
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
