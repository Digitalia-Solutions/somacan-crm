import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Plus, GripVertical, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../lib/api';

const API_URL = `${API_BASE_URL}/blogs`;

export default function AdminBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    intro: '',
    category: 'Science',
    coverImage: '',
    readTime: '5 min',
    isPublished: true,
    sections: []
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/id/${id}`); // I need to fix the backend route for by ID
      setFormData({
        ...data,
        sections: data.sections || []
      });
    } catch (err) {
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        await axios.put(`${API_URL}/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/blogs');
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { heading: '', body: '' }]
    });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const removeSection = (index) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    });
  };

  if (loading) return <div className="p-8 text-stone-400">Chargement...</div>;

  return (
    <div className="w-full pb-12">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/blogs" className="p-2 rounded-full hover:bg-stone-100 text-stone-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-3xl text-somacan-brand">
            {isEdit ? 'Modifier l\'article' : 'Nouvel Article'}
          </h1>
        </div>
        <button 
          onClick={handleSave}
          className="btn-luxury btn-luxury-primary"
        >
          <Save size={18} />
          Enregistrer
        </button>
      </header>

      <form className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">
          {/* Main Info */}
          <div className="bg-white rounded-[2rem] border border-stone-200 p-8 space-y-6 shadow-sm">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 ml-1">Titre de l'article</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:border-stone-900 outline-none font-serif text-xl"
                  placeholder="Ex: Le CBD et la peau..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 ml-1">Slug (URL)</label>
                  <input 
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-200 focus:border-stone-900 outline-none text-sm"
                    placeholder="le-cbd-et-la-peau"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 ml-1">Catégorie</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-5 py-3.5 rounded-2xl border border-stone-200 focus:border-stone-900 outline-none text-sm"
                  >
                    <option value="Science">Science</option>
                    <option value="Art de Vivre">Art de Vivre</option>
                    <option value="Héritage">Héritage</option>
                    <option value="Conseils">Conseils</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 ml-1">Introduction (Intro)</label>
              <textarea 
                rows="3"
                value={formData.intro}
                onChange={(e) => setFormData({...formData, intro: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:border-stone-900 outline-none text-sm leading-relaxed"
                placeholder="Quelques lignes pour accrocher le lecteur..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 ml-1">Extrait (Excerpt)</label>
              <textarea 
                rows="2"
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:border-stone-900 outline-none text-sm leading-relaxed"
                placeholder="Court résumé pour la liste des articles..."
              />
            </div>
          </div>

          {/* Sections Manager */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest px-4">Contenu de l'article</h3>
              <button 
                type="button"
                onClick={addSection}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-somacan-brand hover:bg-stone-50 px-4 py-2 rounded-full transition-all"
              >
                <Plus size={14} /> Ajouter une section
              </button>
            </div>

            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <div key={index} className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm relative group">
                  <button 
                    type="button"
                    onClick={() => removeSection(index)}
                    className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex gap-6">
                    <div className="pt-1 text-stone-300">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Titre de section</label>
                        <input 
                          type="text"
                          value={section.heading}
                          onChange={(e) => updateSection(index, 'heading', e.target.value)}
                          className="w-full px-0 py-2 border-b border-stone-100 focus:border-stone-900 outline-none font-bold text-lg"
                          placeholder="Titre de la section..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Corps du texte</label>
                        <textarea 
                          rows="6"
                          value={section.body}
                          onChange={(e) => updateSection(index, 'body', e.target.value)}
                          className="w-full px-0 py-2 outline-none text-sm leading-relaxed text-stone-600"
                          placeholder="Écrivez le contenu ici..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.sections.length === 0 && (
                <div className="text-center py-20 bg-stone-50/50 rounded-[2rem] border-2 border-dashed border-stone-200">
                  <p className="text-sm text-stone-400">Aucune section ajoutée. Commencez à écrire votre article.</p>
                  <button 
                    type="button"
                    onClick={addSection}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-900 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:bg-stone-900 hover:text-white transition-all"
                  >
                    <Plus size={14} /> Ajouter la première section
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          {/* Publishing Settings */}
          <div className="bg-white rounded-[2rem] border border-stone-200 p-8 space-y-6 shadow-sm sticky top-28">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Paramètres</h4>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-stone-600">Publié en ligne</span>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPublished ? 'bg-stone-900' : 'bg-stone-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPublished ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Temps de lecture</label>
                <input 
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({...formData, readTime: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 outline-none text-sm"
                  placeholder="ex: 5 min"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-stone-100">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Image de couverture</h4>
              <div className="relative group aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 flex flex-col items-center justify-center gap-3">
                {formData.coverImage ? (
                  <>
                    <img src={formData.coverImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, coverImage: ''})}
                        className="p-3 bg-white rounded-full text-red-500 shadow-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-stone-300" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">URL de l'image</p>
                  </>
                )}
              </div>
              <input 
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-stone-900 outline-none text-xs"
                placeholder="URL de l'image..."
              />
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
