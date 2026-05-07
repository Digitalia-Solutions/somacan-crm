import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Plus, RefreshCw, ExternalLink } from 'lucide-react';
import { createAdminContent, createPage, deletePage, deleteSection, getAdminContent, getAdminPageStyle, getPages, reorderSections, updateAdminContent, updateAdminPageStyle } from '../../lib/api';
import SectionCard from './SectionCard';
import SectionEditor from './SectionEditor';

const DEFAULT_PAGE_STYLES = {
  fontFamily: '',
  paragraphFontFamily: '',
  headingFontFamily: '',
  textColor: '',
  paragraphColor: '',
  headingColor: '',
  bodyFontSize: '',
  bodyLineHeight: '',
  paragraphFontSize: '',
  paragraphLineHeight: '',
  h1FontSize: '',
  h2FontSize: '',
  h3FontSize: '',
  h4FontSize: '',
  h5FontSize: '',
  h6FontSize: '',
  customCss: '',
};

export default function PageBuilder() {
  const navigate = useNavigate();
  // --- Page list ---
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [selectedPageKey, setSelectedPageKey] = useState(null);
  
  // --- Sections for selected page ---
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [pageStyles, setPageStyles] = useState(DEFAULT_PAGE_STYLES);
  const [savingStyles, setSavingStyles] = useState(false);

  // --- Editor state ---
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // --- Feedback ---
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- Drag state ---
  const [draggedSection, setDraggedSection] = useState(null);

  // Load all pages from DB
  useEffect(() => {
    setPagesLoading(true);
    getPages()
      .then((data) => {
        setPages(Array.isArray(data) ? data : []);
        // Select home by default if exists
        const home = data.find(p => p.slug === 'home');
        if (home) setSelectedPageKey('home');
      })
      .catch((err) => setError(err.message || 'Impossible de charger les pages.'))
      .finally(() => setPagesLoading(false));
  }, []);

  // Load sections when page is selected
  const loadSections = useCallback((pageKey) => {
    if (!pageKey) {
      setSections([]);
      return;
    }
    setSectionsLoading(true);
    setError('');
    getAdminContent()
      .then((data) => {
        const items = (Array.isArray(data) ? data : [])
          .filter((item) => item.pageKey === pageKey)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setSections(items);
      })
      .catch((err) => setError(err.message || 'Impossible de charger les sections.'))
      .finally(() => setSectionsLoading(false));
  }, []);

  const loadPageStyles = useCallback((pageKey) => {
    if (!pageKey) {
      setPageStyles(DEFAULT_PAGE_STYLES);
      return;
    }
    getAdminPageStyle(pageKey)
      .then((data) => {
        const styles = data?.styles && typeof data.styles === 'object' ? data.styles : {};
        setPageStyles({ ...DEFAULT_PAGE_STYLES, ...styles });
      })
      .catch(() => setPageStyles(DEFAULT_PAGE_STYLES));
  }, []);

  useEffect(() => {
    loadSections(selectedPageKey);
    loadPageStyles(selectedPageKey);
  }, [selectedPageKey, loadSections, loadPageStyles]);

  // --- Actions ---

  function selectPage(pageKey) {
    setSelectedPageKey(pageKey);
    setMessage('');
    setError('');
  }

  function openNewSection() {
    setEditingSection(null);
    setEditorOpen(true);
  }

  function editSection(sectionId) {
    const found = sections.find((s) => s.id === sectionId);
    setEditingSection(found || null);
    setEditorOpen(true);
  }

  async function handleDeleteSection(sectionId) {
    if (!window.confirm('Supprimer cette section ? Cette action est irreversible.')) return;

    setError('');
    setMessage('');
    try {
      await deleteSection(sectionId);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      setMessage('Section supprimee.');
    } catch (err) {
      setError(err.message || 'Impossible de supprimer la section.');
    }
  }

  async function handleSaveSection(data) {
    setError('');
    setMessage('');
    try {
      if (editingSection) {
        const saved = await updateAdminContent(editingSection.id, {
          ...data,
          content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
        });
        setSections((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
        setMessage('Section mise a jour.');
      } else {
        const saved = await createAdminContent({
          ...data,
          pageKey: selectedPageKey || data.pageKey,
          content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content,
        });
        setSections((prev) => [...prev, saved].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
        setMessage('Section creee.');

        // Add page to list if new
        if (!pages.find((p) => p.pageKey === saved.pageKey)) {
          setPages((prev) => [...prev, { pageKey: saved.pageKey, count: 1 }]);
          setSelectedPageKey(saved.pageKey);
        }
      }
      setEditorOpen(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    }
  }

  function handleCreatePage() {
    const name = window.prompt('Nom de la page (slug) :');
    if (!name || !name.trim()) return;
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (pages.find((p) => p.pageKey === slug)) {
      setError('Cette page existe deja.');
      return;
    }
    setPages((prev) => [...prev, { pageKey: slug, count: 0 }]);
    setSelectedPageKey(slug);
    setMessage(`Page "${slug}" creee. Ajoutez des sections.`);
  }

  async function handleSavePageStyles() {
    if (!selectedPageKey) return;
    setSavingStyles(true);
    setError('');
    try {
      await updateAdminPageStyle(selectedPageKey, pageStyles);
      setMessage('Typographie de page mise a jour.');
    } catch (err) {
      setError(err.message || 'Impossible de sauvegarder la typographie.');
    } finally {
      setSavingStyles(false);
    }
  }

  // --- Drag & drop ---

  function onDragStart(e, section) {
    setDraggedSection(section);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  async function onDrop(e, targetSection) {
    e.preventDefault();
    if (!draggedSection || draggedSection.id === targetSection.id) {
      setDraggedSection(null);
      return;
    }

    const fromIdx = sections.findIndex((s) => s.id === draggedSection.id);
    const toIdx = sections.findIndex((s) => s.id === targetSection.id);
    if (fromIdx === -1 || toIdx === -1) {
      setDraggedSection(null);
      return;
    }

    const reordered = [...sections];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const updated = reordered.map((s, i) => ({ ...s, sortOrder: i }));
    setSections(updated);
    setDraggedSection(null);

    try {
      await reorderSections(updated.map((s) => ({ id: s.id, sortOrder: s.sortOrder })));
      setMessage('Ordre mis a jour.');
    } catch (err) {
      setError(err.message || 'Erreur de reordonnancement.');
      loadSections(selectedPageKey);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* Left sidebar - Pages */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Pages</h3>
          <button
            type="button"
            onClick={handleCreatePage}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            title="Nouvelle page"
          >
            <Plus size={14} />
          </button>
        </div>

        {pagesLoading ? (
          <div className="mt-4 flex justify-center">
            <Loader2 size={18} className="animate-spin text-stone-400" />
          </div>
        ) : (
          <div className="mt-3 grid gap-1">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => selectPage(page.slug)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedPageKey === page.slug
                    ? 'bg-stone-900 font-medium text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <FileText size={14} />
                <span className="flex-1 truncate">{page.title || page.slug}</span>
                {!page.isPublished && (
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">Brouillon</span>
                )}
              </button>
            ))}
            {!pages.length && (
              <p className="py-4 text-center text-xs text-stone-400">Aucune page</p>
            )}
          </div>
        )}
      </div>

      {/* Main area - Sections */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm">
        {!selectedPageKey ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText size={40} className="text-stone-300" />
            <p className="mt-4 text-sm text-stone-500">Selectionnez une page pour voir ses sections</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl text-somacan-brand">{selectedPageKey}</h3>
                <p className="text-xs text-stone-400">{sections.length} section(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/content/edit/${selectedPageKey}`)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  <ExternalLink size={14} />
                  Éditeur Visuel
                </button>
                <button
                  type="button"
                  onClick={() => loadSections(selectedPageKey)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  title="Rafraichir"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={openNewSection}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800"
                >
                  <Plus size={14} />
                  Ajouter une section
                </button>
              </div>
            </div>

            {sectionsLoading ? (
              <div className="mt-8 flex justify-center">
                <Loader2 size={20} className="animate-spin text-stone-400" />
              </div>
            ) : (
              <div className="mt-5 grid gap-2">
                {sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onEdit={editSection}
                    onDelete={handleDeleteSection}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                  />
                ))}
                {!sections.length && (
                  <div className="rounded-2xl border-2 border-dashed border-stone-200 py-12 text-center">
                    <p className="text-sm text-stone-400">Aucune section. Cliquez sur "Ajouter une section" pour commencer.</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Page typography</p>
                  <h4 className="mt-1 font-display text-2xl text-somacan-brand">Body, paragraphes, headings</h4>
                </div>
                <button
                  type="button"
                  onClick={handleSavePageStyles}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800"
                  disabled={savingStyles}
                >
                  {savingStyles ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  Enregistrer la typo
                </button>
              </div>

              <div className="grid gap-5">
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Fonts & colors</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ['fontFamily', 'Police globale'],
                      ['paragraphFontFamily', 'Police paragraphes'],
                      ['headingFontFamily', 'Police titres'],
                      ['textColor', 'Couleur texte global'],
                      ['paragraphColor', 'Couleur paragraphes'],
                      ['headingColor', 'Couleur titres'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</label>
                        <input
                          value={pageStyles[key]}
                          onChange={(e) => setPageStyles((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Body & paragraphes</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ['bodyFontSize', 'Taille body'],
                      ['bodyLineHeight', 'Line-height body'],
                      ['paragraphFontSize', 'Taille paragraphes'],
                      ['paragraphLineHeight', 'Line-height paragraphes'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</label>
                        <input
                          value={pageStyles[key]}
                          onChange={(e) => setPageStyles((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Headings H1-H6</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ['h1FontSize', 'H1'],
                      ['h2FontSize', 'H2'],
                      ['h3FontSize', 'H3'],
                      ['h4FontSize', 'H4'],
                      ['h5FontSize', 'H5'],
                      ['h6FontSize', 'H6'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</label>
                        <input
                          value={pageStyles[key]}
                          onChange={(e) => setPageStyles((prev) => ({ ...prev, [key]: e.target.value }))}
                          className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Custom CSS</p>
                  <textarea
                    value={pageStyles.customCss}
                    onChange={(e) => setPageStyles((prev) => ({ ...prev, customCss: e.target.value }))}
                    rows={8}
                    placeholder={'& p { letter-spacing: 0.01em; }\n& h2 { text-transform: uppercase; }'}
                    className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Feedback */}
        {message && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Section Editor Drawer */}
      <SectionEditor
        section={editingSection}
        pageKey={selectedPageKey || ''}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveSection}
      />
    </div>
  );
}
