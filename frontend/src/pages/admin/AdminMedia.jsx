import { useState, useEffect, useRef, useCallback } from 'react';
import { getMediaLibrary, uploadMedia, updateMedia, deleteMedia } from '../../lib/api';
import { Upload, Search, Trash2, Edit3, X, Check, Image } from 'lucide-react';

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null); // item being edited
  const [editForm, setEditForm] = useState({ altText: '', title: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null); // id being deleted
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    getMediaLibrary({ q: search })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  async function handleFiles(files) {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const media = await uploadMedia(file, { title: file.name });
        setItems(prev => [media, ...prev]);
      } catch (err) {
        console.error('Upload failed:', err.message);
      }
    }
    setUploading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function openEdit(item) {
    setSelected(item);
    setEditForm({ altText: item.altText || '', title: item.title || '' });
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await updateMedia(selected.id, editForm);
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
      setSelected(updated);
      setEditForm({ altText: updated.altText || '', title: updated.title || '' });
    } catch (err) {
      console.error('Save failed:', err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await deleteMedia(id);
      setItems(prev => prev.filter(i => i.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error('Delete failed:', err.message);
    } finally {
      setDeleting(null);
    }
  }

  function formatSize(bytes) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="grid gap-6">
      {/* Upload zone */}
      <div
        className={`rounded-[2.2rem] border-2 border-dashed px-6 py-10 text-center cursor-pointer transition ${
          dragOver ? 'border-[#033a22] bg-[#033a22]/5' : 'border-stone-200 bg-white/60 hover:border-stone-300'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={28} className="mx-auto text-stone-400 mb-3" />
        <p className="text-sm font-medium text-stone-600">{uploading ? 'Upload en cours...' : 'Glissez des fichiers ici ou cliquez pour uploader'}</p>
        <p className="text-xs text-stone-400 mt-1">JPG, PNG, WebP, GIF, SVG, PDF — max 10MB</p>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      <div className={`grid gap-6 ${selected ? 'lg:grid-cols-[1fr_320px]' : ''}`}>
        {/* Main grid */}
        <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm">
          {/* Search bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none"
              />
            </div>
            <span className="text-sm text-stone-400">{items.length} fichier{items.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40 text-stone-400 text-sm">Chargement...</div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-stone-400">
              <Image size={32} className="opacity-40" />
              <p className="text-sm">Aucun fichier. Uploadez votre première image.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                    selected?.id === item.id ? 'border-[#033a22]' : 'border-transparent hover:border-stone-200'
                  }`}
                  onClick={() => openEdit(item)}
                >
                  <img
                    src={item.url}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.parentElement.style.background = '#f5f5f4'; e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                    <p className="text-[9px] text-white truncate max-w-[80%]">{item.title || item.filename}</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                      disabled={deleting === item.id}
                      className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit panel */}
        {selected && (
          <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm sticky top-28 self-start">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl text-somacan-brand">Détails</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-full hover:bg-stone-100">
                <X size={16} className="text-stone-400" />
              </button>
            </div>
            <img src={selected.url} alt={selected.altText} className="w-full aspect-video object-cover rounded-xl border border-stone-200 mb-4" />
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1 block">Titre</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full h-10 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1 block">Texte alt (SEO)</label>
                <input
                  type="text"
                  value={editForm.altText}
                  onChange={e => setEditForm(p => ({ ...p, altText: e.target.value }))}
                  placeholder="Description de l'image pour l'accessibilité"
                  className="w-full h-10 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none"
                />
              </div>
              <div className="text-xs text-stone-400 space-y-1">
                <p>Fichier: {selected.filename}</p>
                <p>Taille: {formatSize(selected.size)}</p>
                <p>Type: {selected.mimeType}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex-1 btn-luxury btn-luxury-primary justify-center">
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
                <button
                  onClick={() => { if (window.confirm('Supprimer ce fichier ?')) handleDelete(selected.id); }}
                  className="px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
