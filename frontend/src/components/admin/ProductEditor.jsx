import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Image as ImageIcon, Box, List, Star, Upload, Loader2 } from 'lucide-react';
import { uploadAdminImage } from '../../lib/api';

export default function ProductEditor({ product, categories, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(product);
  const [activeTab, setActiveTab] = useState('general');
  const [uploading, setUploading] = useState(null); // 'main' or index

  useEffect(() => {
    setFormData(product);
  }, [product]);

  if (!isOpen) return null;

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(type);
      const { url } = await uploadAdminImage(file);
      
      if (type === 'main') {
        setFormData(prev => ({ ...prev, mainImage: url }));
      } else {
        const newImages = [...formData.images];
        newImages[type] = url;
        setFormData(prev => ({ ...prev, images: newImages }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Échec de l\'upload de l\'image.');
    } finally {
      setUploading(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    
    // Auto-slug logic
    if (name === 'name' && (!formData.slug || formData.slug === formData.name.toLowerCase().replace(/\s+/g, '-'))) {
      setFormData(prev => ({
        ...prev,
        [name]: finalValue,
        slug: finalValue.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-stone-900/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-4xl bg-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-8 py-6">
          <div>
            <h2 className="font-display text-3xl text-somacan-brand">
              {product.id ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-stone-400">Catalogue Somacan</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-stone-100 text-stone-400">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-stone-100">
          {[
            { id: 'general', label: 'Général', icon: List },
            { id: 'inventory', label: 'Inventaire', icon: Box },
            { id: 'images', label: 'Images', icon: ImageIcon },
            { id: 'marketing', label: 'Marketing', icon: Star },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab.id ? 'border-somacan-brand text-somacan-brand' : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-stone-50/50">
          {activeTab === 'general' && (
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Nom du produit</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm outline-none focus:border-somacan-brand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Slug (URL)</label>
                  <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm outline-none focus:border-somacan-brand"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Catégorie</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId || ''}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm outline-none"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Prix (MAD)</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm outline-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Ingrédients</label>
                  <button onClick={() => addArrayItem('ingredients')} className="text-somacan-brand text-xs font-bold">+ Ajouter</button>
                </div>
                <div className="grid gap-3">
                  {formData.ingredients?.map((ing, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={ing}
                        onChange={(e) => handleArrayChange('ingredients', i, e.target.value)}
                        className="flex-1 h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none"
                      />
                      <button onClick={() => removeArrayItem('ingredients', i)} className="p-3 text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid gap-8">
              <div className="rounded-[2.5rem] bg-white p-8 border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-display text-2xl text-somacan-brand">État du stock</h3>
                    <p className="text-xs text-stone-400">Contrôlez la disponibilité du produit</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="inStock"
                      checked={formData.inStock} 
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-14 h-8 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-somacan-brand"></div>
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Quantité en stock</label>
                    <input
                      name="stockCount"
                      type="number"
                      value={formData.stockCount}
                      onChange={handleChange}
                      className="w-full h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Prix d'origine (Ancien prix)</label>
                    <input
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="Laissez à 0 si pas de réduction"
                      className="w-full h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="grid gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Image Principale</label>
                <div className="flex gap-6 items-start">
                  <div className="relative group w-48 h-48 rounded-3xl bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.mainImage ? (
                      <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-stone-300" size={32} />
                    )}
                    {uploading === 'main' && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="animate-spin text-somacan-brand" size={24} />
                      </div>
                    )}
                    <label className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'main')} accept="image/*" />
                      <Upload className="text-white" size={24} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <input
                      name="mainImage"
                      value={formData.mainImage}
                      onChange={handleChange}
                      placeholder="URL de l'image (ou utilisez l'icône d'upload)"
                      className="w-full h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm outline-none"
                    />
                    <p className="text-xs text-stone-400">Cliquez sur le cadre pour uploader une image ou collez une URL directe.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Galerie d'images</label>
                  <button onClick={() => addArrayItem('images')} className="text-somacan-brand text-xs font-bold">+ Ajouter une image</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {formData.images?.map((img, i) => (
                    <div key={i} className="rounded-2xl border border-stone-100 bg-white p-3 space-y-3 shadow-sm">
                      <div className="relative group aspect-square rounded-xl bg-stone-50 overflow-hidden">
                        {img ? <img src={img} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center text-stone-300"><ImageIcon size={20} /></div>}
                        {uploading === i && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="animate-spin text-somacan-brand" size={20} />
                          </div>
                        )}
                        <label className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, i)} accept="image/*" />
                          <Upload className="text-white" size={20} />
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={img}
                          onChange={(e) => handleArrayChange('images', i, e.target.value)}
                          placeholder="URL"
                          className="flex-1 h-10 rounded-lg border border-stone-200 bg-white px-3 text-[10px] outline-none"
                        />
                        <button onClick={() => removeArrayItem('images', i)} className="text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="grid gap-6">
              <div className="rounded-[2.5rem] bg-white p-8 border border-stone-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl text-somacan-brand">Mise en avant</h3>
                    <p className="text-xs text-stone-400">Gérez l'affichage sur la boutique</p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="isFeatured"
                      checked={formData.isFeatured} 
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-stone-300 text-somacan-brand focus:ring-somacan-brand" 
                    />
                    <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Produit Vedette (Hero Section)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="isBestseller"
                      checked={formData.isBestseller} 
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-stone-300 text-somacan-brand focus:ring-somacan-brand" 
                    />
                    <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">Bestseller (Badge & Filtre)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Bienfaits (Benefits)</label>
                  <button onClick={() => addArrayItem('benefits')} className="text-somacan-brand text-xs font-bold">+ Ajouter</button>
                </div>
                <div className="grid gap-3">
                  {formData.benefits?.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={item}
                        onChange={(e) => handleArrayChange('benefits', i, e.target.value)}
                        className="flex-1 h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none"
                      />
                      <button onClick={() => removeArrayItem('benefits', i)} className="p-3 text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 px-8 py-6 bg-white flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:bg-stone-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            className="btn-luxury btn-luxury-primary"
          >
            <Save size={14} />
            Enregistrer le produit
          </button>
        </div>
      </div>
    </div>
  );
}
