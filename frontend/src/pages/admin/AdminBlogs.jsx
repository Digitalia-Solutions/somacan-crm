import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../lib/api';

const API_URL = `${API_BASE_URL}/blogs`;
const ADMIN_API_URL = `${API_BASE_URL}/blogs/all`;

export default function AdminBlogs() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(ADMIN_API_URL);
      setArticles(data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="font-display text-3xl text-somacan-brand">Journal / Blog</h1>
          <p className="text-sm text-stone-500 mt-1">Gérez vos articles et inspirations.</p>
        </div>
        <Link 
          to="/admin/blogs/new" 
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
        >
          <Plus size={18} />
          Nouvel Article
        </Link>
      </div>

      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-stone-200 overflow-x-auto shadow-sm">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 border-b border-stone-100">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Article</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Catégorie</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Date</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400">Statut</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center text-stone-400">Chargement...</td></tr>
            ) : filteredArticles.length === 0 ? (
              <tr><td colSpan="5" className="px-8 py-20 text-center text-stone-400">Aucun article trouvé.</td></tr>
            ) : filteredArticles.map((article) => (
              <tr key={article.id} className="group hover:bg-stone-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={article.coverImage} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-stone-900">{article.title}</p>
                      <p className="text-[11px] text-stone-400 mt-0.5 tracking-tight">/{article.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-stone-600">{article.category}</td>
                <td className="px-8 py-6 text-sm text-stone-500">
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-8 py-6">
                  {article.isPublished ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                      <Eye size={10} /> Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                      <EyeOff size={10} /> Brouillon
                    </span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      to={`/blog/${article.slug}`} 
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-white text-stone-400 hover:text-stone-900 shadow-sm border border-transparent hover:border-stone-200 transition-all"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <Link 
                      to={`/admin/blogs/edit/${article.id}`} 
                      className="p-2 rounded-lg hover:bg-white text-stone-400 hover:text-somacan-brand shadow-sm border border-transparent hover:border-stone-200 transition-all"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 shadow-sm border border-transparent hover:border-stone-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
