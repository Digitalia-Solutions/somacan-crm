import { useState, useEffect, useRef } from 'react';
import { getMediaLibrary, uploadMedia } from '../../lib/api';
import { Search, Upload, X, Check, Image } from 'lucide-react';

/**
 * MediaPicker modal
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   onSelect: (media: { id, url, altText, title }) => void
 *   currentUrl: string (currently selected url, shown as checked)
 */
export default function MediaPicker({ open, onClose, onSelect, currentUrl }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null); // { id, url, altText, title }
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getMediaLibrary({ q: search })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, search]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const media = await uploadMedia(file, { title: file.name });
      setItems(prev => [media, ...prev]);
      setSelected(media);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.2rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">CMS</p>
            <h2 className="font-display text-3xl text-somacan-brand mt-1">Médiathèque</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-100 transition">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-[#033a22]/20"
            />
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-60 transition"
          >
            <Upload size={14} />
            {uploading ? 'Upload...' : 'Uploader'}
          </button>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-stone-400 text-sm">Chargement...</div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-stone-400">
              <Image size={32} className="opacity-40" />
              <p className="text-sm">Aucun media. Uploadez votre première image.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map(item => {
                const isSelected = selected?.id === item.id || (!selected && currentUrl === item.url);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                      isSelected ? 'border-[#033a22] shadow-lg' : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.altText || item.title || item.filename}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = ''; e.target.parentElement.style.background = '#f5f5f4'; }}
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#033a22]/20 flex items-center justify-center">
                        <Check size={20} className="text-white drop-shadow" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1 opacity-0 hover:opacity-100 transition">
                      <p className="text-[9px] text-white truncate">{item.title || item.filename}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {selected && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 bg-stone-50">
            <div className="flex items-center gap-3">
              <img src={selected.url} alt="" className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
              <div>
                <p className="text-sm font-medium text-stone-800">{selected.title || selected.filename}</p>
                {selected.altText && <p className="text-xs text-stone-400">{selected.altText}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-luxury btn-luxury-primary"
            >
              Sélectionner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
