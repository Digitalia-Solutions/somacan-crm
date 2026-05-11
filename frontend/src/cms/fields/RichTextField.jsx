import { FieldWrapper } from '../FieldRenderer';

export default function RichTextField({ label, value, onChange, hint, required, error, description }) {
  const commonProps = { label, hint, required, error, description };

  return (
    <FieldWrapper {...commonProps}>
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        placeholder="Saisissez votre contenu HTML ici..."
        className="w-full h-64 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all resize-y"
      />
    </FieldWrapper>
  );
}
