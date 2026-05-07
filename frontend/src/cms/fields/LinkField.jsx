export default function LinkField({ label, value, onChange, hint }) {
  const link = value || { url: '', text: '', target: '_self' };

  function update(key, val) {
    onChange({ ...link, [key]: val });
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}
      <div className="border border-stone-200 rounded-xl bg-stone-50 p-3 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500">URL</label>
          <input
            type="text"
            value={link.url ?? ''}
            onChange={(e) => update('url', e.target.value)}
            placeholder="https://..."
            className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500">Texte du lien</label>
          <input
            type="text"
            value={link.text ?? ''}
            onChange={(e) => update('text', e.target.value)}
            placeholder="Cliquez ici"
            className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-500">Cible</label>
          <select
            value={link.target ?? '_self'}
            onChange={(e) => update('target', e.target.value)}
            className="border border-stone-200 rounded-lg bg-white px-3 py-1.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
          >
            <option value="_self">Même onglet (_self)</option>
            <option value="_blank">Nouvel onglet (_blank)</option>
          </select>
        </div>
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
