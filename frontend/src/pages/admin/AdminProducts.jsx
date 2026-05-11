import { useEffect, useState } from 'react';
import { 
  Package, Plus, Search, Filter, MoreVertical, 
  Edit3, Trash2, ExternalLink, AlertCircle, Loader2,
  TrendingUp, Star
} from 'lucide-react';
import { 
  createAdminProduct, getAdminCategories, getAdminProducts, 
  updateAdminProduct, deleteProduct 
} from '../../lib/api';
import ProductEditor from '../../components/admin/ProductEditor';

const emptyProduct = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  originalPrice: 0,
  category: 'wellness',
  categoryId: '',
  mainImage: '',
  images: [],
  ingredients: [],
  benefits: [],
  usage: '',
  inStock: true,
  stockCount: 0,
  isFeatured: false,
  isBestseller: false,
  tags: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getAdminProducts(), 
        getAdminCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(emptyProduct);
    setEditorOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditorOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (data.id) {
        const updated = await updateAdminProduct(data.id, data);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setMessage('Produit mis à jour avec succès.');
      } else {
        const created = await createAdminProduct(data);
        setProducts(prev => [created, ...prev]);
        setMessage('Produit créé avec succès.');
      }
      setEditorOpen(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit définitivement ?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setMessage('Produit supprimé.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression.');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-lg">
            <Package size={20} />
          </div>
          <div>
            <h1 className="font-display text-4xl text-somacan-brand">Catalogue</h1>
            <p className="text-xs text-stone-400">{products.length} produits enregistrés</p>
          </div>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="btn-luxury btn-luxury-primary w-fit self-end md:self-auto"
        >
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid gap-4 md:grid-cols-[1fr_200px] items-center">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-somacan-brand transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-14 pr-6 rounded-2xl border border-stone-200/70 bg-white shadow-sm outline-none focus:border-somacan-brand focus:ring-1 focus:ring-somacan-brand/10 transition-all"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-14 pl-10 pr-4 rounded-2xl border border-stone-200/70 bg-white shadow-sm outline-none appearance-none text-sm font-medium"
          >
            <option value="all">Toutes catégories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {/* Error/Message UI */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in zoom-in-95">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {message && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 animate-in fade-in zoom-in-95">
          <Package size={18} />
          {message}
        </div>
      )}

      {/* Product List */}
      <div className="rounded-[2.5rem] border border-stone-200/70 bg-white overflow-hidden shadow-[0_20px_60px_rgba(28,25,23,0.04)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-stone-200" size={40} />
            <p className="text-sm text-stone-400 font-medium">Récupération du catalogue...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Produit</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Catégorie</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Prix</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Stock</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Visibilité</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 shadow-sm">
                          {product.mainImage ? (
                            <img src={product.mainImage} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                        {categories.find(c => c.id === product.categoryId)?.name || 'Wellness'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-stone-900">{product.price} MAD</span>
                        {product.originalPrice > 0 && (
                          <span className="text-[10px] text-stone-400 line-through">{product.originalPrice} MAD</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {product.inStock ? 'En stock' : 'Épuisé'}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest">{product.stockCount} unités</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.isFeatured && (
                          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100" title="Featured">
                            <Star size={12} fill="currentColor" />
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-100" title="Bestseller">
                            <TrendingUp size={12} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="p-2.5 rounded-xl text-stone-400 hover:bg-stone-200/50 hover:text-stone-900 transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <a 
                          href={`/shop/${product.slug}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2.5 rounded-xl text-stone-400 hover:bg-stone-200/50 hover:text-somacan-brand transition-all"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredProducts.length && (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="max-w-xs mx-auto">
                        <Package size={40} className="mx-auto text-stone-100 mb-4" />
                        <p className="text-stone-500 font-medium">Aucun produit ne correspond à votre recherche.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductEditor 
        product={editingProduct || emptyProduct}
        categories={categories}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
