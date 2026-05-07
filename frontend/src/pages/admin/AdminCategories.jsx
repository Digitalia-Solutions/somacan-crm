import { useEffect, useState } from 'react';
import { 
  FolderTree, Plus, Save, Edit3, Trash2, 
  Image as ImageIcon, Loader2, AlertCircle, CheckCircle2, Upload
} from 'lucide-react';
import { createAdminCategory, getAdminCategories, updateAdminCategory, uploadAdminImage } from '../../lib/api';

const emptyCategory = {
  name: '',
  slug: '',
  description: '',
  image: '',
  color: '',
  active: true,
  sortOrder: 0,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await uploadAdminImage(file);
      setEditingCategory(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Échec de l\'upload de l\'image.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Impossible de charger les catégories.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(emptyCategory);
    setEditorOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setEditorOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      if (editingCategory.id) {
        const saved = await updateAdminCategory(editingCategory.id, editingCategory);
        setCategories(prev => prev.map(c => c.id === saved.id ? { ...saved, productCount: editingCategory.productCount } : c));
        setMessage('Catégorie mise à jour.');
      } else {
        const created = await createAdminCategory(editingCategory);
        setCategories(prev => [{ ...created, productCount: 0 }, ...prev]);
        setMessage('Catégorie créée.');
      }
      setEditorOpen(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    if (name === 'name' && (!editingCategory.slug || editingCategory.slug === editingCategory.name.toLowerCase().replace(/\s+/g, '-'))) {
      setEditingCategory(prev => ({
        ...prev,
        [name]: finalValue,
        slug: finalValue.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    } else {
      setEditingCategory(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-lg">
            <FolderTree size={20} />
          </div>
          <div>
            <h1 className="font-display text-4xl text-somacan-brand">Catégories</h1>
            <p className="text-xs text-stone-400">Gérez l'organisation de vos produits</p>
          </div>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="btn-luxury btn-luxury-primary"
        >
          <Plus size={16} />
          Nouvelle catégorie
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in zoom-in-95">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 animate-in fade-in zoom-in-95">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {/* Grid view of categories */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-[2.5rem] bg-stone-100 animate-pulse" />
          ))
        ) : (
          categories.map((category) => (
            <div 
              key={category.id} 
              className="group relative overflow-hidden rounded-[2.5rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] transition-all hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 overflow-hidden shrink-0 shadow-inner">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEdit(category)}
                    className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-900"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="font-display text-2xl text-somacan-brand">{category.name}</h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">{category.slug}</p>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-display text-stone-900">{category.productCount || 0}</span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Produits</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                    category.active ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {category.active ? 'Active' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Sidebar/Drawer */}
      {editorOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-stone-900/40 backdrop-blur-sm">
          <div className="h-full w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-100 px-8 py-6">
              <h2 className="font-display text-3xl text-somacan-brand">
                {editingCategory.id ? 'Modifier' : 'Nouvelle catégorie'}
              </h2>
              <button onClick={() => setEditorOpen(false)} className="rounded-full p-2 hover:bg-stone-100 text-stone-400">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Nom</label>
                <input
                  name="name"
                  value={editingCategory.name}
                  onChange={handleChange}
                  required
                  className="w-full h-14 rounded-2xl border border-stone-200 bg-stone-50/50 px-5 text-sm outline-none focus:border-somacan-brand"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Slug</label>
                <input
                  name="slug"
                  value={editingCategory.slug}
                  onChange={handleChange}
                  required
                  className="w-full h-14 rounded-2xl border border-stone-200 bg-stone-50/50 px-5 text-sm outline-none focus:border-somacan-brand"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Image</label>
                <div className="flex gap-6 items-start">
                  <div className="relative group w-24 h-24 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                    {editingCategory.image ? (
                      <img src={editingCategory.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-stone-300" size={24} />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="animate-spin text-somacan-brand" size={20} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                      <Upload className="text-white" size={20} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input
                      name="image"
                      value={editingCategory.image}
                      onChange={handleChange}
                      placeholder="URL ou upload..."
                      className="w-full h-12 rounded-xl border border-stone-200 bg-stone-50/50 px-4 text-sm outline-none focus:border-somacan-brand"
                    />
                    <p className="text-[10px] text-stone-400 font-medium">Cliquez sur le cadre pour uploader une image.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Description</label>
                <textarea
                  name="description"
                  value={editingCategory.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-5 py-4 text-sm outline-none focus:border-somacan-brand"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group p-4 rounded-2xl border border-stone-100 hover:bg-stone-50 transition-colors">
                <input 
                  type="checkbox" 
                  name="active"
                  checked={editingCategory.active} 
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-stone-300 text-somacan-brand focus:ring-somacan-brand" 
                />
                <span className="text-sm font-medium text-stone-700">Catégorie active (visible sur le site)</span>
              </label>
            </form>

            <div className="border-t border-stone-100 px-8 py-6 bg-white">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-luxury btn-luxury-primary w-full justify-center"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Enregistrer la catégorie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
