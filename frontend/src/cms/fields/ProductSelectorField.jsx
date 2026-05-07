import { useEffect, useState } from 'react';
import { getAdminProducts } from '../../lib/api';

export default function ProductSelectorField({ label, value, onChange, hint, multiple = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getAdminProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.products || data?.data || [];
        setProducts(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selected = multiple
    ? Array.isArray(value) ? value : (value ? [value] : [])
    : value;

  function isSelected(id) {
    if (multiple) return (selected || []).includes(id);
    return selected === id;
  }

  function toggle(id) {
    if (multiple) {
      const current = Array.isArray(selected) ? selected : [];
      if (current.includes(id)) {
        onChange(current.filter((v) => v !== id));
      } else {
        onChange([...current, id]);
      }
    } else {
      onChange(selected === id ? null : id);
    }
  }

  const filtered = products.filter((p) => {
    const name = p.name || p.title || p.nom || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">
          {label}
          {multiple && <span className="ml-1 text-xs text-stone-400">(sélection multiple)</span>}
        </label>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un produit..."
        className="border border-stone-200 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
      />

      <div className="border border-stone-200 rounded-xl bg-stone-50 max-h-48 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-6 text-sm text-stone-400">
            Chargement...
          </div>
        )}
        {error && (
          <div className="py-3 px-3 text-sm text-red-500">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-3 px-3 text-sm text-stone-400">Aucun produit trouvé.</div>
        )}
        {!loading && filtered.map((product) => {
          const id = product._id || product.id;
          const name = product.name || product.title || product.nom || id;
          const selected_ = isSelected(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition hover:bg-stone-100 border-b border-stone-100 last:border-b-0 ${
                selected_ ? 'bg-[#033a22]/5 text-[#033a22] font-medium' : 'text-stone-700'
              }`}
            >
              <span
                className={`w-4 h-4 flex-shrink-0 rounded border transition ${
                  selected_
                    ? 'bg-[#033a22] border-[#033a22]'
                    : 'border-stone-300 bg-white'
                }`}
              >
                {selected_ && (
                  <svg viewBox="0 0 16 16" fill="white" className="w-full h-full p-0.5">
                    <path d="M13.3 4.3L6.7 10.9 3.7 7.9l-1.4 1.4 4.4 4.4 8-8z" />
                  </svg>
                )}
              </span>
              {product.image && (
                <img src={product.image} alt="" className="w-6 h-6 object-cover rounded" />
              )}
              <span className="truncate">{name}</span>
            </button>
          );
        })}
      </div>

      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}
