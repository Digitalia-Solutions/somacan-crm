import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import {
  FileText, Loader2, Plus, RefreshCw, Eye, EyeOff,
  Trash2, Copy, ChevronUp, ChevronDown, Pencil, Check, X,
  Search, Filter, Monitor, Tablet, Smartphone, Globe, Lock,
  MoreVertical, ArrowLeft, Save, Undo2, Redo2, Layout, Sparkles,
  Zap, Settings, MousePointer2, AlertCircle, History, RotateCcw, GripVertical
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove, sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  getPageSections, createPageSection, updatePageSection,
  deletePageSection, duplicatePageSection, reorderPageSections,
  togglePageSection, getAdminPages, createAdminPage, updateAdminPage
} from '../../lib/api';
import { SECTION_TYPES, getSectionDef, getDefaultContent, getDefaultSettings, getDefaultWidgetTree } from '../../cms/SectionRegistry';
import SectionFormRenderer from '../../cms/SectionFormRenderer';
import useCmsPageState from '../../cms/v2/useCmsPageState';
import PageRenderer from '../../cms/v2/PageRenderer';
import { getTemplateDefinition } from '../../../../shared/cms/templates.js';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { AnimatePresence, motion } from 'framer-motion';

// --- Icons mapping helper ---
function getSectionIcon(iconName) {
  const icons = {
    sparkles: <Sparkles size={18} />,
    arrow: <ArrowLeft size={18} className="rotate-180" />,
    globe: <Globe size={18} />,
    star: <Plus size={18} />,
    leaf: <Layout size={18} />,
    flask: <Zap size={18} />,
    layout: <Layout size={18} />,
    grid: <Layout size={18} />,
    story: <Layout size={18} />,
    testimonial: <Layout size={18} />,
    faq: <Layout size={18} />,
    zap: <Zap size={18} />,
    heart: <Layout size={18} />,
    check: <Check size={18} />,
    sun: <Globe size={18} />,
    moon: <Globe size={18} />,
    shield: <Lock size={18} />,
  };
  return icons[iconName] || <Layout size={18} />;
}

export default function PageBuilder2() {
  const { success, error: showError, info } = useToast();
  
  // --- Page list ---
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);

  // --- Sections for selected page ---
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const pageState = useCmsPageState([]);
  const sections = pageState.draftSections;

  // --- Search & Filter ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- Editor state ---
  const [editingSection, setEditingSection] = useState(null);
  const [addingSection, setAddingSection] = useState(false);
  const drawerDirtyRef = useRef(false);

  // --- Live Preview ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewZoom, setPreviewZoom] = useState(100);

  // --- SEO Editor ---
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoFields, setSeoFields] = useState({ metaTitle: '', metaDescription: '', ogImage: '', canonicalUrl: '', noIndex: false });
  const [seoSaving, setSeoSaving] = useState(false);

  // Load all pages from DB
  useEffect(() => {
    setPagesLoading(true);
    getAdminPages()
      .then((data) => {
        const sortedPages = Array.isArray(data) ? data : [];
        setPages(sortedPages);
        // Select home by default if exists
        const home = sortedPages.find(p => p.slug === 'home');
        if (home) setSelectedPage(home);
      })
      .catch((err) => showError(err.message || 'Impossible de charger les pages.'))
      .finally(() => setPagesLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load sections when page is selected
  const loadSections = useCallback((pageSlug) => {
    if (!pageSlug) {
      pageState.replaceAll([]);
      return;
    }
    setSectionsLoading(true);
    getPageSections(pageSlug)
      .then((data) => {
        const items = (Array.isArray(data) ? data : [])
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        pageState.replaceAll(items);
      })
      .catch((err) => showError(err.message || 'Impossible de charger les sections.'))
      .finally(() => setSectionsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedPage?.slug) {
      loadSections(selectedPage.slug);
      setSeoFields({
        metaTitle: selectedPage.metaTitle || '',
        metaDescription: selectedPage.metaDescription || '',
        ogImage: selectedPage.ogImage || '',
        canonicalUrl: selectedPage.canonicalUrl || '',
        noIndex: selectedPage.noIndex || false,
      });
    }
  }, [selectedPage?.slug, loadSections]);

  // Global CMD+S hint when no section is open
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        if (!editingSection) {
          e.preventDefault();
          info('Utilisez le bouton Enregistrer dans l\'éditeur de section');
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingSection, info]);

  // --- Filtered Sections ---
  const filteredSections = useMemo(() => {
    return sections.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sections, searchQuery]);

  // --- Actions ---

  async function handleCreatePage() {
    const name = window.prompt('Nom de la page (ex: blog, contact) :');
    if (!name || !name.trim()) return;

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (pages.find((p) => p.slug === slug)) {
      showError('Cette page existe déjà.');
      return;
    }

    try {
      const newPage = await createAdminPage({ slug, title: name, isPublished: false });
      setPages((prev) => [...prev, newPage]);
      setSelectedPage(newPage);
      success(`Page "${name}" créée.`);
    } catch (err) {
      showError(err.message || 'Impossible de créer la page.');
    }
  }

  async function handleDeleteSection(sectionId) {
    if (!window.confirm('Supprimer cette section ?')) return;
    try {
      await deletePageSection(sectionId);
      pageState.removeServerSection(sectionId);
      success('Section supprimée.');
    } catch (err) {
      showError(err.message || 'Impossible de supprimer la section.');
    }
  }

  async function handleDuplicateSection(section) {
    try {
      const duplicated = await duplicatePageSection(section.id);
      pageState.addServerSection(duplicated);
      success('Section dupliquée.');
    } catch (err) {
      showError(err.message || 'Impossible de dupliquer la section.');
    }
  }

  async function handleMoveSection(sectionId, direction) {
    const idx = sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;

    let newIdx = idx;
    if (direction === 'up' && idx > 0) newIdx = idx - 1;
    else if (direction === 'down' && idx < sections.length - 1) newIdx = idx + 1;
    else return;

    const reordered = [...sections];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(newIdx, 0, moved);

    const updated = reordered.map((s, i) => ({ ...s, order: i }));
    pageState.setDraftOrder(updated);

    try {
      await reorderPageSections(updated.map((s) => ({ id: s.id, order: s.order })));
      success('Ordre mis à jour.');
    } catch (err) {
      showError(err.message || 'Erreur de réordonnancement.');
      loadSections(selectedPage?.slug);
    }
  }

  async function handleToggleSection(sectionId) {
    try {
      const updated = await togglePageSection(sectionId);
      pageState.applyServerSection(updated);
      success(updated.isActive ? 'Section visible' : 'Section masquée');
    } catch (err) {
      showError('Impossible de changer la visibilité.');
    }
  }

  async function handleSaveSection(updatedData) {
    try {
      const saved = await updatePageSection(editingSection.id, updatedData);
      pageState.applyServerSection(saved);
      success('Modifications enregistrées.');
      setEditingSection(null);
    } catch (err) {
      showError(err.message || 'Erreur lors de la sauvegarde.');
    }
  }

  function handleAddSectionType(type) {
    if (!selectedPage) return;

    const def = getSectionDef(type);
    const newSection = {
      pageSlug: selectedPage.slug,
      pageId: selectedPage.id,
      type,
      name: def?.label || type,
      order: sections.length,
      isActive: true,
      content: getDefaultContent(type),
      settings: getDefaultSettings(type),
      animation: def?.defaultAnimation || { type: 'none' },
      responsive: {},
      widgetTree: getDefaultWidgetTree(type),
    };

    createPageSection(newSection)
      .then((created) => {
        pageState.addServerSection(created);
        setAddingSection(false);
        success('Nouvelle section ajoutée.');
      })
      .catch((err) => showError(err.message || 'Erreur lors de l\'ajout.'));
  }

  const previewPage = useMemo(() => ({
    ...selectedPage,
    sections: sections,
    template: selectedPage?.template || 'custom',
  }), [selectedPage, sections]);

  const handleDraftChange = useCallback((patch) => {
    if (!editingSection?.id) return;
    pageState.updateDraftSection(editingSection.id, patch);
  }, [editingSection?.id, pageState]);

  const handleResetDraft = useCallback(() => {
    if (!editingSection?.id) return;
    pageState.resetDraftSection(editingSection.id);
  }, [editingSection?.id, pageState]);

  return (
    <div className={`grid gap-8 min-h-0 ${previewOpen ? 'lg:grid-cols-[240px_minmax(0,1fr)_minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]'} transition-all duration-300`}>
      {/* Pages Sidebar */}
      <div className="flex flex-col gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Pages</h3>
            <Button variant="ghost" size="xs" onClick={handleCreatePage} icon={Plus}>
              New
            </Button>
          </div>

          {pagesLoading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-stone-300" /></div>
          ) : (
            <div className="grid gap-1.5">
              {pages.map((page) => {
                const isActive = selectedPage?.id === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      if (editingSection && drawerDirtyRef.current) {
                        if (!window.confirm('Vous avez des modifications non sauvées. Changer de page ?')) return;
                        setEditingSection(null);
                      }
                      setSelectedPage(page);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-stone-900 text-white shadow-lg ring-1 ring-white/10' 
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <FileText size={16} className={isActive ? 'text-white' : 'text-stone-400'} />
                    <span className="flex-1 text-sm font-bold truncate text-left">{page.title || page.slug}</span>
                    {page.isPublished && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        {selectedPage && (
          <Card className="p-6 bg-stone-950 text-white border-none shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-2">Statut Page</p>
            <div className="flex items-center justify-between">
              <Badge variant={selectedPage.isPublished ? 'success' : 'outline'} className={selectedPage.isPublished ? '' : 'text-stone-400 border-stone-800'}>
                {selectedPage.isPublished ? 'En ligne' : 'Brouillon'}
              </Badge>
              <Button
                size="xs"
                variant="outline"
                className="text-white border-stone-800 hover:border-white"
                onClick={async () => {
                  try {
                    const next = !selectedPage.isPublished;
                    await updateAdminPage(selectedPage.id, { isPublished: next });
                    setPages(prev => prev.map(p => p.id === selectedPage.id ? { ...p, isPublished: next } : p));
                    setSelectedPage(prev => ({ ...prev, isPublished: next }));
                    success(next ? 'Page publiée' : 'Page en brouillon');
                  } catch (err) { showError('Erreur fatale.'); }
                }}
              >
                {selectedPage.isPublished ? 'Dépublier' : 'Publier'}
              </Button>
            </div>
          </Card>
        )}

        {selectedPage && (
          <Card className="overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => setSeoOpen(o => !o)}
            >
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-stone-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">SEO</span>
              </div>
              <ChevronDown size={16} className={`text-stone-400 transition-transform ${seoOpen ? 'rotate-180' : ''}`} />
            </button>
            {seoOpen && (
              <div className="px-5 pb-5 border-t border-stone-100 pt-4 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1.5">Titre SEO</label>
                  <input
                    type="text"
                    value={seoFields.metaTitle}
                    onChange={e => setSeoFields(f => ({ ...f, metaTitle: e.target.value }))}
                    placeholder={selectedPage.title}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-stone-400"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">{seoFields.metaTitle.length}/60</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1.5">Méta Description</label>
                  <textarea
                    value={seoFields.metaDescription}
                    onChange={e => setSeoFields(f => ({ ...f, metaDescription: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-stone-400 resize-none"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">{seoFields.metaDescription.length}/160</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1.5">OG Image URL</label>
                  <input
                    type="text"
                    value={seoFields.ogImage}
                    onChange={e => setSeoFields(f => ({ ...f, ogImage: e.target.value }))}
                    placeholder="/asset/..."
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-stone-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-1.5">URL Canonique</label>
                  <input
                    type="text"
                    value={seoFields.canonicalUrl}
                    onChange={e => setSeoFields(f => ({ ...f, canonicalUrl: e.target.value }))}
                    placeholder="https://somacan.com/..."
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-900 outline-none focus:border-stone-400"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoFields.noIndex}
                    onChange={e => setSeoFields(f => ({ ...f, noIndex: e.target.checked }))}
                    className="w-4 h-4 rounded border-stone-300"
                  />
                  <span className="text-xs font-bold text-stone-600">noindex (masquer du moteur de recherche)</span>
                </label>
                <Button
                  variant="primary"
                  size="sm"
                  loading={seoSaving}
                  onClick={async () => {
                    setSeoSaving(true);
                    try {
                      const updated = await updateAdminPage(selectedPage.id, seoFields);
                      setPages(prev => prev.map(p => p.id === selectedPage.id ? { ...p, ...seoFields } : p));
                      setSelectedPage(prev => ({ ...prev, ...seoFields }));
                      success('SEO sauvegardé');
                    } catch (err) {
                      showError('Erreur lors de la sauvegarde SEO');
                    } finally {
                      setSeoSaving(false);
                    }
                  }}
                  icon={Save}
                >
                  Sauvegarder SEO
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Sections Area */}
      <div className="flex flex-col gap-6">
        {!selectedPage ? (
          <Card className="py-32 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-stone-50 flex items-center justify-center text-stone-200 mb-6">
              <FileText size={40} />
            </div>
            <h4 className="text-xl font-display text-stone-400">Aucune page sélectionnée</h4>
            <p className="text-sm text-stone-400 mt-2">Choisissez une page dans le menu latéral pour commencer l'édition.</p>
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl text-somacan-brand">{selectedPage.title || selectedPage.slug}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-stone-400 border-stone-200 font-mono">/{selectedPage.slug}</Badge>
                  <span className="text-xs text-stone-400 font-bold tracking-tight">• {sections.length} sections</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="md" onClick={() => loadSections(selectedPage.slug)} icon={RefreshCw}>
                  Rafraîchir
                </Button>
                <Button
                  variant={previewOpen ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setPreviewOpen(p => !p)}
                  icon={previewOpen ? EyeOff : Eye}
                >
                  {previewOpen ? 'Masquer aperçu' : 'Aperçu live'}
                </Button>
                <Button variant="primary" size="md" onClick={() => setAddingSection(true)} icon={Plus}>
                  Ajouter une section
                </Button>
              </div>
            </div>

            <Card className="p-4 flex items-center gap-3">
              <Search size={18} className="text-stone-400" />
              <input 
                type="text" 
                placeholder="Rechercher une section par nom ou type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-stone-900 placeholder:text-stone-300"
              />
              <div className="h-6 w-px bg-stone-100 mx-2" />
              <Filter size={18} className="text-stone-400" />
            </Card>

            <div className="grid gap-4">
              {sectionsLoading ? (
                <div className="grid gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 rounded-[2rem] bg-stone-100 animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
                  ))}
                </div>
              ) : filteredSections.length > 0 ? (
                <SectionSortableList
                  sections={filteredSections}
                  allSections={sections}
                  getSectionDef={getSectionDef}
                  getSectionIcon={getSectionIcon}
                  onReorder={async (reordered) => {
                    pageState.setDraftOrder(reordered);
                    try {
                      await reorderPageSections(reordered.map((s, i) => ({ id: s.id, order: i })));
                      success('Ordre mis à jour.');
                    } catch {
                      showError('Erreur de réordonnancement.');
                      loadSections(selectedPage?.slug);
                    }
                  }}
                  onToggle={handleToggleSection}
                  onEdit={setEditingSection}
                  onDuplicate={handleDuplicateSection}
                  onMove={handleMoveSection}
                  onDelete={handleDeleteSection}
                  onRename={(section, newName) => {
                    updatePageSection(section.id, { name: newName })
                      .then((updated) => { pageState.applyServerSection(updated); success('Nom mis à jour'); })
                      .catch(() => showError('Erreur lors du renommage'));
                  }}
                />
              ) : (
                <div className="py-20 text-center rounded-[2rem] border-2 border-dashed border-stone-200">
                  <p className="text-sm font-bold text-stone-400">
                    {searchQuery ? 'Aucun résultat pour cette recherche' : 'Aucune section définie pour cette page'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setAddingSection(true)} icon={Plus}>
                    Ajouter ma première section
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Live Preview Panel */}
      {previewOpen && selectedPage && (
        <div className="flex flex-col gap-4 min-h-0">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white rounded-xl border border-stone-200 p-1">
              {[
                { id: 'desktop', icon: Monitor, label: '1440px' },
                { id: 'tablet', icon: Tablet, label: '768px' },
                { id: 'mobile', icon: Smartphone, label: '375px' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setPreviewDevice(d.id)}
                  title={d.label}
                  className={`p-2 rounded-lg transition-all ${previewDevice === d.id ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-400 hover:text-stone-700'}`}
                >
                  <d.icon size={16} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-white rounded-xl border border-stone-200 p-1">
              {[50, 75, 100].map(z => (
                <button key={z} onClick={() => setPreviewZoom(z)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${previewZoom === z ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-700'}`}>
                  {z}%
                </button>
              ))}
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              {previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '768px' : '1440px'}
            </span>
          </div>

          {/* Preview frame */}
          <div className="flex-1 bg-stone-100 rounded-[2rem] overflow-auto flex justify-center p-4 min-h-[600px]">
            <div style={{
              transform: `scale(${previewZoom / 100})`,
              transformOrigin: 'top center',
              width: previewZoom < 100 ? `${10000 / previewZoom}%` : '100%',
            }}>
              <div className="flex justify-center">
                <div className={`bg-white shadow-2xl overflow-hidden transition-all duration-500 ${
                  previewDevice === 'mobile'
                    ? 'w-[375px] rounded-[2.5rem] ring-8 ring-stone-800'
                    : previewDevice === 'tablet'
                    ? 'w-[768px] rounded-2xl ring-4 ring-stone-300'
                    : 'w-full max-w-[1440px]'
                }`}>
                  <div className="bg-stone-50 border-b border-stone-100 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                    </div>
                    <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest ml-2 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Aperçu live
                    </span>
                  </div>
                  <PageRenderer page={previewPage} previewMode />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay Edit Drawer */}
      <AnimatePresence>
        {editingSection && (
          <EditSectionDrawer
            section={editingSection}
            pageSections={sections}
            onDraftChange={handleDraftChange}
            onResetDraft={handleResetDraft}
            onClose={() => setEditingSection(null)}
            onSave={handleSaveSection}
            dirtyRef={drawerDirtyRef}
          />
        )}
      </AnimatePresence>

      {/* Add Section Modal */}
      {addingSection && (
        <AddSectionModal
          templateKey={selectedPage?.template}
          onClose={() => setAddingSection(false)}
          onSelectType={handleAddSectionType}
        />
      )}
    </div>
  );
}

// ─── Sortable Section Card ──────────────────────────────────────────────────

function SortableSectionCard({ section, index, allSections, getSectionDef, getSectionIcon, onToggle, onEdit, onDuplicate, onMove, onDelete, onRename }) {
  const realIndex = allSections.findIndex(s => s.id === section.id);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const def = getSectionDef(section.type);
  const isWidget = section.widgetTree?.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center gap-5 rounded-[2.2rem] border p-5 bg-white transition-all duration-300 ${
        isDragging ? 'shadow-2xl ring-2 ring-stone-900/10 z-50' :
        !section.isActive ? 'border-stone-100 bg-stone-50/50' :
        'border-stone-200 hover:border-stone-900 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 p-1 text-stone-200 hover:text-stone-500 cursor-grab active:cursor-grabbing touch-none transition-colors"
        title="Glisser pour réordonner"
        aria-label="Réordonner"
      >
        <GripVertical size={18} />
      </button>

      {/* Left: Icon & Order */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
          !section.isActive ? 'bg-stone-100 text-stone-300' :
          'bg-stone-50 text-stone-400 group-hover:bg-stone-900 group-hover:text-white group-hover:rotate-6'
        }`}>
          {getSectionIcon(def?.icon)}
        </div>
        <span className="text-[10px] font-bold text-stone-300 font-mono tracking-tighter">#{index + 1}</span>
      </div>

      {/* Center: Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <SectionNameEditor section={section} onSave={(name) => onRename(section, name)} />
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="py-0 text-[9px] font-mono border-stone-200 text-stone-400 uppercase">{section.type}</Badge>
            {isWidget && (
              <Badge variant="outline" className="py-0 text-[9px] font-mono border-emerald-100 text-emerald-600 bg-emerald-50/30">
                Widgets ({section.widgetTree.length})
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${section.isActive ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-widest ${section.isActive ? 'text-emerald-600' : 'text-stone-400'}`}>
              {section.isActive ? 'Publiée' : 'Masquée'}
            </span>
          </div>
          {section.animation?.type && section.animation.type !== 'none' && (
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">{section.animation.type}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <div className="flex items-center bg-stone-100 rounded-2xl p-1 gap-1">
          <Button variant="ghost" size="sm" onClick={() => onToggle(section.id)} icon={section.isActive ? Eye : EyeOff} className="h-9 w-9 p-0" title="Visibilité" />
          <Button variant="ghost" size="sm" onClick={() => onEdit(section)} icon={Pencil} className="h-9 w-9 p-0" title="Éditer" />
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(section)} icon={Copy} className="h-9 w-9 p-0" title="Dupliquer" />
        </div>
        <div className="flex items-center bg-stone-100 rounded-2xl p-1 gap-1">
          <Button variant="ghost" size="sm" onClick={() => onMove(section.id, 'up')} disabled={realIndex === 0} icon={ChevronUp} className="h-9 w-9 p-0" />
          <Button variant="ghost" size="sm" onClick={() => onMove(section.id, 'down')} disabled={realIndex === allSections.length - 1} icon={ChevronDown} className="h-9 w-9 p-0" />
        </div>
        <Button
          variant="danger" size="sm"
          onClick={() => { if (window.confirm('Supprimer définitivement cette section ?')) onDelete(section.id); }}
          icon={Trash2} className="h-11 w-11 rounded-2xl"
        />
      </div>
    </div>
  );
}

const DROP_ANIMATION = {
  duration: 200,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
};

function SectionSortableList({ sections, allSections, getSectionDef, getSectionIcon, onReorder, onToggle, onEdit, onDuplicate, onMove, onDelete, onRename }) {
  const [activeId, setActiveId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  // Search allSections for the ghost overlay (filtered list may not contain it)
  const activeSection = allSections.find(s => s.id === activeId);

  async function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIdx = allSections.findIndex(s => s.id === active.id);
    const newIdx = allSections.findIndex(s => s.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = arrayMove([...allSections], oldIdx, newIdx).map((s, i) => ({ ...s, order: i }));
    setIsReordering(true);
    try {
      await onReorder(reordered);
    } finally {
      setIsReordering(false);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => !isReordering && setActiveId(active.id)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div className={`grid gap-4 transition-opacity ${isReordering ? 'opacity-60 pointer-events-none' : ''}`}>
          {sections.map((section, index) => (
            <SortableSectionCard
              key={section.id}
              section={section}
              index={index}
              allSections={allSections}
              getSectionDef={getSectionDef}
              getSectionIcon={getSectionIcon}
              onToggle={onToggle}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onMove={onMove}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={DROP_ANIMATION}>
        {activeSection ? (
          <div className="flex items-center gap-5 rounded-[2.2rem] border-2 border-stone-900 p-5 bg-white shadow-2xl opacity-95 cursor-grabbing">
            <GripVertical size={18} className="text-stone-400 shrink-0" />
            <div className="h-14 w-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center shrink-0">
              {getSectionIcon(getSectionDef(activeSection.type)?.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-900 truncate">{activeSection.name}</p>
              <p className="text-[10px] font-mono text-stone-400 mt-0.5">{activeSection.type}</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Section Name Editor ────────────────────────────────────────────────────

function SectionNameEditor({ section, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(section.name);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === section.name) {
      setIsEditing(false);
      setName(section.name);
      return;
    }
    onSave(trimmed);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          className="text-xl font-display text-somacan-brand bg-stone-50 border-b-2 border-somacan-brand outline-none px-1 py-0.5"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          onBlur={handleSave}
        />
      </div>
    );
  }

  return (
    <h3 
      className="text-xl font-display text-stone-900 group-hover/name:text-somacan-brand cursor-pointer flex items-center gap-2 group/name"
      onClick={() => setIsEditing(true)}
    >
      {section.name}
      <Pencil size={14} className="opacity-0 group-hover/name:opacity-100 text-stone-300 hover:text-somacan-brand transition-all" />
    </h3>
  );
}

function EditSectionDrawer({ section, pageSections, onDraftChange, onResetDraft, onClose, onSave, dirtyRef }) {
  const { warning, success, info } = useToast();
  const DRAFT_KEY = `cms_draft_${section.id}`;
  const VERSIONS_KEY = `cms_versions_${section.id}`;
  const onDraftChangeRef = useRef(onDraftChange);
  const onResetDraftRef = useRef(onResetDraft);

  // ── Core state ──────────────────────────────────────────────
  const [content, setContent] = useState(section.content || {});
  const [settings, setSettings] = useState(section.settings || {});
  const [animation, setAnimation] = useState(section.animation || {});
  const [responsive, setResponsive] = useState(section.responsive || {});
  const [widgetTree, setWidgetTree] = useState(section.widgetTree || []);
  const [saving, setSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    onDraftChangeRef.current = onDraftChange;
  }, [onDraftChange]);

  useEffect(() => {
    onResetDraftRef.current = onResetDraft;
  }, [onResetDraft]);

  // ── History (undo/redo) ──────────────────────────────────────
  const historyRef = useRef([]);
  const historyIdxRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const skipHistoryRef = useRef(false); // prevent push during undo/redo restore

  function snapshot() {
    return JSON.parse(JSON.stringify({ content, settings, animation, responsive, widgetTree }));
  }

  function pushHistory(snap) {
    const stack = historyRef.current;
    const idx = historyIdxRef.current;
    // Truncate any redo tail
    stack.splice(idx + 1);
    stack.push(snap);
    if (stack.length > 50) stack.shift();
    historyIdxRef.current = stack.length - 1;
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
  }

  function undo() {
    const stack = historyRef.current;
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current--;
    const snap = stack[historyIdxRef.current];
    skipHistoryRef.current = true;
    setContent(snap.content);
    setSettings(snap.settings);
    setAnimation(snap.animation);
    setResponsive(snap.responsive);
    setWidgetTree(snap.widgetTree);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(true);
  }

  function redo() {
    const stack = historyRef.current;
    if (historyIdxRef.current >= stack.length - 1) return;
    historyIdxRef.current++;
    const snap = stack[historyIdxRef.current];
    skipHistoryRef.current = true;
    setContent(snap.content);
    setSettings(snap.settings);
    setAnimation(snap.animation);
    setResponsive(snap.responsive);
    setWidgetTree(snap.widgetTree);
    setCanUndo(true);
    setCanRedo(historyIdxRef.current < stack.length - 1);
  }

  // Push initial snapshot on mount
  useEffect(() => {
    const initial = JSON.parse(JSON.stringify({ content, settings, animation, responsive, widgetTree }));
    historyRef.current = [initial];
    historyIdxRef.current = 0;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced history push on state changes
  useEffect(() => {
    if (skipHistoryRef.current) { skipHistoryRef.current = false; return; }
    const timer = setTimeout(() => pushHistory(snapshot()), 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, settings, animation, responsive, widgetTree]);

  // ── Dirty state ──────────────────────────────────────────────
  const isDirty = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(section.content || {}) ||
           JSON.stringify(settings) !== JSON.stringify(section.settings || {}) ||
           JSON.stringify(animation) !== JSON.stringify(section.animation || {}) ||
           JSON.stringify(responsive) !== JSON.stringify(section.responsive || {}) ||
           JSON.stringify(widgetTree) !== JSON.stringify(section.widgetTree || []);
  }, [content, settings, animation, responsive, widgetTree, section]);

  // Expose dirty state to parent via ref
  useEffect(() => {
    if (dirtyRef) dirtyRef.current = isDirty;
  }, [isDirty, dirtyRef]);

  // Warn on browser close/refresh
  useEffect(() => {
    if (!isDirty) return;
    function onBeforeUnload(e) { e.preventDefault(); e.returnValue = ''; }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    onDraftChangeRef.current?.({ content, settings, animation, responsive, widgetTree });
  }, [content, settings, animation, responsive, widgetTree]);

  // ── Autosave draft ───────────────────────────────────────────
  const [hasDraftRecovery, setHasDraftRecovery] = useState(false);
  const recoveredDraftRef = useRef(null);
  const [autosavedAt, setAutosavedAt] = useState(null);

  // On mount: check for existing draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        const serverStr = JSON.stringify({ content: section.content || {}, settings: section.settings || {}, animation: section.animation || {}, responsive: section.responsive || {}, widgetTree: section.widgetTree || [] });
        const draftStr = JSON.stringify({ content: draft.content, settings: draft.settings, animation: draft.animation, responsive: draft.responsive, widgetTree: draft.widgetTree });
        if (draftStr !== serverStr) {
          recoveredDraftRef.current = draft;
          setHasDraftRecovery(true);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave every 10s when dirty
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDirty) return;
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ content, settings, animation, responsive, widgetTree, savedAt: Date.now() }));
        setAutosavedAt(Date.now());
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, content, settings, animation, responsive, widgetTree]);

  function restoreDraft() {
    const draft = recoveredDraftRef.current;
    if (!draft) return;
    skipHistoryRef.current = true;
    setContent(draft.content || {});
    setSettings(draft.settings || {});
    setAnimation(draft.animation || {});
    setResponsive(draft.responsive || {});
    setWidgetTree(draft.widgetTree || []);
    setHasDraftRecovery(false);
    info('Brouillon restauré.');
  }

  function dismissDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setHasDraftRecovery(false);
  }

  // ── Save + version snapshot ──────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ content, settings, animation, responsive, widgetTree });
      // Version snapshot
      try {
        const raw = localStorage.getItem(VERSIONS_KEY);
        const versions = raw ? JSON.parse(raw) : [];
        versions.push({ timestamp: Date.now(), sectionId: section.id, content, settings, widgetTree });
        if (versions.length > 10) versions.shift();
        localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
      } catch {}
      // Clear autosave draft on successful save
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      setAutosavedAt(null);
    } finally {
      setSaving(false);
    }
  }

  // ── Keyboard shortcuts ───────────────────────────────────────
  useEffect(() => {
    function onCmsSave() { if (!saving) handleSave(); }
    function onCmsClose() {
      if (isDirty) { if (window.confirm('Quitter sans enregistrer ?')) onClose(); }
      else onClose();
    }
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA';
      if (e.key === 'Escape' && !inField) { onCmsClose(); return; }
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); return; }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') { e.preventDefault(); redo(); return; }
    }
    window.addEventListener('cms:save', onCmsSave);
    window.addEventListener('cms:close', onCmsClose);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('cms:save', onCmsSave);
      window.removeEventListener('cms:close', onCmsClose);
      window.removeEventListener('keydown', onKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, saving, canUndo, canRedo]);

  const previewSections = pageSections.map((s) => s.id === section.id ? { ...s, content, settings, animation, responsive, widgetTree } : s);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-stone-950/40 backdrop-blur-sm flex justify-end"
    >
      <div className="absolute inset-0" onClick={() => isDirty ? (window.confirm('Quitter sans enregistrer ?') && onClose()) : onClose()} />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[95vw] lg:max-w-[1400px] bg-white shadow-2xl flex flex-col h-screen overflow-hidden"
      >
        {/* Sticky Header */}
        <header className="shrink-0 flex items-center justify-between px-8 py-5 border-b border-stone-100 bg-white">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" onClick={() => { if (isDirty) { if (!window.confirm('Quitter sans enregistrer ?')) return; } onClose(); }} icon={ArrowLeft}>Retour</Button>
            <div className="h-10 w-px bg-stone-100" />
            <div>
              <h2 className="text-2xl font-display text-somacan-brand leading-none">{section.name}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1.5 flex items-center gap-2">
                Section Editor <span className="text-stone-200">•</span> {section.type}
                {isDirty && <Badge variant="warning" className="ml-2 py-0">Non sauvé</Badge>}
                {!isDirty && autosavedAt && <span className="text-emerald-500 ml-2">Brouillon auto-sauvé</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Undo / Redo */}
            <div className="flex items-center bg-stone-100 rounded-xl p-1 gap-0.5">
              <button
                onClick={undo} disabled={!canUndo}
                title="Annuler (⌘Z)"
                className="p-2 rounded-lg transition-all disabled:opacity-30 text-stone-500 hover:text-stone-900 hover:bg-white"
              >
                <Undo2 size={15} />
              </button>
              <button
                onClick={redo} disabled={!canRedo}
                title="Rétablir (⌘⇧Z)"
                className="p-2 rounded-lg transition-all disabled:opacity-30 text-stone-500 hover:text-stone-900 hover:bg-white"
              >
                <Redo2 size={15} />
              </button>
            </div>

             <div className="flex items-center bg-stone-100 rounded-xl p-1 gap-1 mr-2">
               {[
                 { id: 'desktop', icon: Monitor },
                 { id: 'tablet', icon: Tablet },
                 { id: 'mobile', icon: Smartphone }
               ].map(d => (
                 <button
                   key={d.id}
                   onClick={() => setPreviewDevice(d.id)}
                   className={`p-2 rounded-lg transition-all ${previewDevice === d.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                 >
                   <d.icon size={16} />
                 </button>
               ))}
             </div>
             <Button variant="secondary" onClick={() => { onResetDraftRef.current?.(); success('Modifications annulées'); }} icon={RotateCcw}>Réinitialiser</Button>
             <Button variant="primary" loading={saving} onClick={handleSave} icon={Save}>Enregistrer</Button>
          </div>
        </header>

        {/* Draft recovery banner */}
        {hasDraftRecovery && (
          <div className="shrink-0 flex items-center justify-between gap-4 px-8 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex items-center gap-3 text-amber-700">
              <History size={16} className="shrink-0" />
              <span className="text-xs font-bold">
                Un brouillon non sauvegardé a été trouvé
                {recoveredDraftRef.current?.savedAt && (
                  <span className="font-normal text-amber-500 ml-1">
                    — {new Date(recoveredDraftRef.current.savedAt).toLocaleTimeString()}
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={restoreDraft} className="text-xs font-bold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors">
                Restaurer
              </button>
              <span className="text-amber-300">·</span>
              <button onClick={dismissDraft} className="text-xs font-bold text-amber-400 hover:text-amber-700 transition-colors">
                Ignorer
              </button>
            </div>
          </div>
        )}

        {/* Layout: Sidebar + Preview */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Controls Sidebar */}
          <div className="w-[450px] shrink-0 border-r border-stone-100 overflow-y-auto min-h-0 bg-white scrollbar-hide">
            <SectionFormRenderer
              type={section.type}
              content={content}
              settings={settings}
              animation={animation}
              responsive={responsive}
              widgetTree={widgetTree}
              onContentChange={setContent}
              onSettingsChange={setSettings}
              onAnimationChange={setAnimation}
              onResponsiveChange={setResponsive}
              onWidgetTreeChange={setWidgetTree}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 min-h-0 min-w-0 bg-stone-100/50 flex flex-col overflow-hidden">
            {/* Zoom toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-stone-50 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-stone-100">
                {[50, 75, 100].map(z => (
                  <button key={z} onClick={() => setZoom(z)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${zoom === z ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-700'}`}>
                    {z}%
                  </button>
                ))}
                <button onClick={() => setZoom(100)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold text-stone-400 hover:text-stone-700 border-l border-stone-100 ml-0.5">
                  Fit
                </button>
              </div>
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                {previewDevice === 'mobile' ? '390px' : previewDevice === 'tablet' ? '768px' : '1280px'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', width: zoom < 100 ? `${10000 / zoom}%` : '100%' }}>
                <div className="flex justify-center">
                  <div
                    className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden h-fit ${
                      previewDevice === 'mobile'
                        ? 'w-[390px] rounded-[2.5rem] ring-8 ring-stone-800 ring-offset-0'
                        : previewDevice === 'tablet'
                        ? 'w-[768px] rounded-2xl ring-4 ring-stone-300'
                        : 'w-full max-w-[1280px]'
                    }`}
                  >
                    <div className="bg-stone-50 border-b border-stone-100 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                      </div>
                      <div className="text-[10px] font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {previewDevice.toUpperCase()} PREVIEW
                      </div>
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('cms:refresh-preview'))}
                        className="p-1.5 rounded-lg text-stone-300 hover:text-stone-600 hover:bg-stone-200 transition-all"
                        title="Rafraîchir l'aperçu"
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                    <PageRenderer page={{ sections: previewSections, template: 'custom' }} previewMode />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddSectionModal({ templateKey, onClose, onSelectType }) {
  const [query, setQuery] = useState('');
  const templateDef = getTemplateDefinition(templateKey || 'custom');
  const allowed = templateDef.allowedSectionTypes || SECTION_TYPES;
  
  const filtered = SECTION_TYPES
    .filter(type => allowed.includes(type))
    .filter(type => {
      const def = getSectionDef(type);
      return type.toLowerCase().includes(query.toLowerCase()) || 
             def?.label.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <div className="fixed inset-0 z-[100] bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="p-10 pb-6 border-b border-stone-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-display text-somacan-brand leading-none">Ajouter une section</h2>
              <p className="text-sm text-stone-400 mt-2">Choisissez un bloc pour composer votre page</p>
            </div>
            <button onClick={onClose} className="h-12 w-12 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-stone-50 rounded-2xl px-5 py-4 ring-1 ring-stone-100">
            <Search size={20} className="text-stone-300" />
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une section..."
              className="bg-transparent border-none outline-none text-base font-bold text-stone-900 w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 scrollbar-hide">
          {filtered.map(type => {
            const def = getSectionDef(type);
            return (
              <button
                key={type}
                onClick={() => onSelectType(type)}
                className="group flex flex-col p-6 rounded-[2rem] border border-stone-100 bg-white hover:border-stone-900 hover:shadow-xl transition-all text-left"
              >
                <div className="h-14 w-14 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white transition-all mb-4">
                  {getSectionIcon(def?.icon)}
                </div>
                <h4 className="text-sm font-bold text-stone-900">{def?.label}</h4>
                <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mt-1">{type}</p>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
