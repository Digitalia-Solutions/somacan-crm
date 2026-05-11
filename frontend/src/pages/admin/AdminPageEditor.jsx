import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, GripVertical, Settings, 
  Monitor, Smartphone, Eye, ExternalLink, Loader2 
} from 'lucide-react';
import { getPageBySlug, updateAdminContent, createAdminContent, deleteSection, reorderSections } from '../../lib/api';
import SectionEditor from '../../components/admin/SectionEditor';

export default function AdminPageEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [previewNonce, setPreviewNonce] = useState(0);
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPageBySlug(slug);
      setPage(data);
      setSections(data.sections || []);
    } catch (err) {
      console.error('Error loading page editor:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveSection = async (data) => {
    try {
      setSaving(true);
      if (editingSection) {
        await updateAdminContent(editingSection.id, data);
      } else {
        await createAdminContent({ ...data, pageKey: slug });
      }
      await loadData();
      setPreviewNonce((prev) => prev + 1);
      setEditorOpen(false);
      setMessage('Modifications enregistrées.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving section:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Supprimer cette section ?')) return;
    try {
      await deleteSection(id);
      setSections(prev => prev.filter(s => s.id !== id));
      setPreviewNonce((prev) => prev + 1);
    } catch (err) {
      console.error('Error deleting section:', err);
    }
  };

  return (
    <div className="flex flex-col bg-stone-50 -m-10 h-[calc(100vh-80px)] overflow-hidden">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 shadow-sm z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/content')}
            className="rounded-full p-2 hover:bg-stone-100 text-stone-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl text-somacan-brand">{page?.title || slug}</h1>
            <p className="text-[10px] uppercase tracking-widest text-stone-400">Éditeur de Page</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Device Toggle */}
          <div className="flex rounded-xl bg-stone-100 p-1">
            <button 
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
            >
              <Monitor size={16} />
            </button>
            <button 
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
            >
              <Smartphone size={16} />
            </button>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-50">
            <Eye size={14} />
            Prévisualiser
          </button>
          
          <button className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-stone-800">
            <Save size={14} />
            Publier
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Section List */}
        <aside className="w-[340px] flex flex-col border-r border-stone-200 bg-white z-20 shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">Sections</h2>
              <button 
                onClick={() => { setEditingSection(null); setEditorOpen(true); }}
                className="rounded-full bg-stone-100 p-2 text-stone-900 hover:bg-stone-200 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {sections.map((section, idx) => (
                <div 
                  key={section.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('sectionId', section.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const draggedId = parseInt(e.dataTransfer.getData('sectionId'));
                    if (draggedId === section.id) return;
                    
                    const fromIdx = sections.findIndex(s => s.id === draggedId);
                    const toIdx = sections.findIndex(s => s.id === section.id);
                    
                    const newSections = [...sections];
                    const [moved] = newSections.splice(fromIdx, 1);
                    newSections.splice(toIdx, 0, moved);
                    
                    const updated = newSections.map((s, i) => ({ ...s, sortOrder: i * 10 }));
                    setSections(updated);
                    
                    try {
                      await reorderSections(updated.map(s => ({ id: s.id, sortOrder: s.sortOrder })));
                    } catch (err) {
                      console.error('Failed to reorder:', err);
                      loadData();
                    }
                  }}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`group relative flex items-center gap-3 rounded-2xl border p-4 transition-all cursor-pointer ${
                    activeSectionId === section.id 
                      ? 'border-stone-900 bg-stone-900 text-white shadow-lg' 
                      : 'border-stone-200 bg-white hover:border-stone-400'
                  }`}
                >
                  <GripVertical size={16} className={activeSectionId === section.id ? 'text-stone-500' : 'text-stone-300'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate uppercase tracking-wider">
                      {section.sectionKey}
                    </p>
                    <p className={`text-[10px] mt-1 ${activeSectionId === section.id ? 'text-stone-400' : 'text-stone-500'}`}>
                      {section.content?.type || section.contentType}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingSection(section); setEditorOpen(true); }}
                      className={`p-1.5 rounded-lg ${activeSectionId === section.id ? 'hover:bg-white/10' : 'hover:bg-stone-100'}`}
                    >
                      <Settings size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                      className={`p-1.5 rounded-lg ${activeSectionId === section.id ? 'hover:bg-white/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-12 px-4 rounded-3xl border-2 border-dashed border-stone-100">
                  <p className="text-sm text-stone-400">Aucune section. Commencez par en ajouter une.</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area - Live Preview */}
        <main className="flex-1 bg-stone-100 p-8 overflow-y-auto flex items-center justify-center">
          <div 
            className={`bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden rounded-[2.5rem] ${
              previewDevice === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full h-full max-w-[1440px]'
            }`}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-stone-300" size={40} />
              </div>
            ) : (
              <iframe 
                key={previewNonce}
                src={`/${slug}?preview=true&refresh=${previewNonce}`} 
                className="w-full h-full border-none"
                title="Page Preview"
              />
            )}
          </div>
        </main>
      </div>

      {message && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-2xl bg-emerald-900 px-6 py-3 text-sm font-bold text-white shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4">
          {message}
        </div>
      )}

      {/* Editor Sidebar/Drawer */}
      <SectionEditor
        section={editingSection}
        pageKey={slug}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveSection}
      />
    </div>
  );
}
