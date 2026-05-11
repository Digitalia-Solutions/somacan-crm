import { FieldWrapper } from '../FieldRenderer';

export default function LinkField({ label, value, onChange, hint, required, error, description }) {
  const link = value || { url: '', text: '', target: '_self' };

  function update(key, val) {
    onChange({ ...link, [key]: val });
  }

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="grid gap-4 p-5 rounded-2xl border border-stone-200 bg-stone-50/50">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">URL de destination</label>
          <input
            type="text"
            value={link.url ?? ''}
            onChange={(e) => update('url', e.target.value)}
            placeholder="https://... ou /page"
            className="h-11 border border-stone-200 rounded-xl bg-white px-4 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Libellé du lien</label>
          <input
            type="text"
            value={link.text ?? ''}
            onChange={(e) => update('text', e.target.value)}
            placeholder="ex: En savoir plus"
            className="h-11 border border-stone-200 rounded-xl bg-white px-4 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Cible (Target)</label>
          <select
            value={link.target ?? '_self'}
            onChange={(e) => update('target', e.target.value)}
            className="h-11 border border-stone-200 rounded-xl bg-white px-4 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all appearance-none"
          >
            <option value="_self">Même onglet (_self)</option>
            <option value="_blank">Nouvel onglet (_blank)</option>
          </select>
        </div>
      </div>
    </FieldWrapper>
  );
}
