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
import { FieldWrapper } from '../FieldRenderer';

const ICONS = [
  { key: 'leaf', label: 'Feuille', Icon: Leaf },
  { key: 'flask', label: 'Soin', Icon: FlaskConical },
  { key: 'sparkles', label: 'Eclat', Icon: Sparkles },
  { key: 'shield', label: 'Protect', Icon: ShieldCheck },
  { key: 'star', label: 'Etoile', Icon: Star },
  { key: 'heart', label: 'Coeur', Icon: Heart },
  { key: 'check', label: 'Valide', Icon: Check },
  { key: 'arrow', label: 'Flèche', Icon: ArrowRight },
  { key: 'globe', label: 'Monde', Icon: Globe },
  { key: 'zap', label: 'Flash', Icon: Zap },
  { key: 'sun', label: 'Jour', Icon: Sun },
  { key: 'moon', label: 'Nuit', Icon: Moon },
];

export default function IconPickerField({ label, value, onChange, hint, required, error, description }) {
  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-3 border border-stone-200 rounded-2xl bg-stone-50/50 shadow-inner">
        {ICONS.map(({ key, label: iconLabel, Icon }) => {
          const isActive = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={iconLabel}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-lg ring-1 ring-stone-900'
                  : 'bg-white text-stone-400 border border-stone-100 hover:border-stone-900 hover:text-stone-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'scale-110' : ''} />
              <span className="text-[8px] font-bold uppercase tracking-widest leading-none">{iconLabel}</span>
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
