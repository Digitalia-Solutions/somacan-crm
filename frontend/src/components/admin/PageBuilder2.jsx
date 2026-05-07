import { useCallback, useEffect, useState } from 'react';
import {
  FileText, Loader2, Plus, RefreshCw, Eye, EyeOff,
  Trash2, Copy, ChevronUp, ChevronDown, Pencil, Check, X
} from 'lucide-react';
import {
  getPageSections, createPageSection, updatePageSection,
  deletePageSection, duplicatePageSection, reorderPageSections,
  togglePageSection, getPages, createAdminPage, updateAdminPage
} from '../../lib/api';
import { SECTION_TYPES, getSectionDef, getDefaultContent, getDefaultSettings, getDefaultWidgetTree } from '../../cms/SectionRegistry';
import SectionFormRenderer from '../../cms/SectionFormRenderer';
import useCmsPageState from '../../cms/v2/useCmsPageState';
import PreviewRenderer from '../../cms/v2/PreviewRenderer';
import { getTemplateDefinition } from '../../../../shared/cms/templates.js';

export default function PageBuilder2() {
  // --- Page list ---
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);

  // --- Sections for selected page ---
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const pageState = useCmsPageState([]);
  const sections = pageState.draftSections;

  // --- Editor state ---
  const [editingSection, setEditingSection] = useState(null);
  const [addingSection, setAddingSection] = useState(false);

  // --- Feedback ---
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load all pages from DB
  useEffect(() => {
    setPagesLoading(true);
    getPages()
      .then((data) => {
        setPages(Array.isArray(data) ? data : []);
        // Select home by default if exists
        const home = data.find(p => p.slug === 'home');
        if (home) selectPage(home);
      })
      .catch((err) => setError(err.message || 'Impossible de charger les pages.'))
      .finally(() => setPagesLoading(false));
  }, []);

  // Auto-dismiss message after 4 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(''), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // Load sections when page is selected
  const loadSections = useCallback((pageSlug) => {
    if (!pageSlug) {
      pageState.replaceAll([]);
      return;
    }
    setSectionsLoading(true);
    setError('');
    getPageSections(pageSlug)
      .then((data) => {
        const items = (Array.isArray(data) ? data : [])
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        pageState.replaceAll(items);
      })
      .catch((err) => setError(err.message || 'Impossible de charger les sections.'))
      .finally(() => setSectionsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedPage?.slug) {
      loadSections(selectedPage.slug);
    }
  }, [selectedPage?.slug, loadSections]);

  // --- Actions ---

  function selectPage(page) {
    setSelectedPage(page);
    setMessage('');
    setError('');
  }

  function handleCreatePage() {
    const name = window.prompt('Nom de la page (ex: blog, contact) :');
    if (!name || !name.trim()) return;

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (pages.find((p) => p.slug === slug)) {
      setError('Cette page existe deja.');
      return;
    }

    setError('');
    setMessage('');
    createAdminPage({ slug, title: name, isPublished: false })
      .then((newPage) => {
        setPages((prev) => [...prev, newPage]);
        selectPage(newPage);
        setMessage(`Page "${name}" creee. Ajoutez des sections.`);
      })
      .catch((err) => setError(err.message || 'Impossible de creer la page.'));
  }

  async function handleDeleteSection(sectionId) {
    if (!window.confirm('Supprimer cette section ? Cette action est irreversible.')) return;

    setError('');
    setMessage('');
    try {
      await deletePageSection(sectionId);
      pageState.removeServerSection(sectionId);
      setMessage('Section supprimee.');
    } catch (err) {
      setError(err.message || 'Impossible de supprimer la section.');
    }
  }

  async function handleDuplicateSection(section) {
    setError('');
    setMessage('');
    try {
      const duplicated = await duplicatePageSection(section.id);
      pageState.addServerSection(duplicated);
      setMessage('Section dupliquee.');
    } catch (err) {
      setError(err.message || 'Impossible de dupliquer la section.');
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
      setMessage('Ordre mis a jour.');
    } catch (err) {
      setError(err.message || 'Erreur de reordonnancement.');
      loadSections(selectedPage?.slug);
    }
  }

  async function handleToggleSection(sectionId) {
    setError('');
    setMessage('');
    try {
      const updated = await togglePageSection(sectionId);
      pageState.applyServerSection(updated);
      setMessage('Visibilite mise a jour.');
    } catch (err) {
      setError(err.message || 'Impossible de basculer la visibilite.');
    }
  }

  async function handleSaveSection(updatedData) {
    setError('');
    setMessage('');
    try {
      const saved = await updatePageSection(editingSection.id, updatedData);
      pageState.applyServerSection(saved);
      setMessage('Section mise a jour.');
      setEditingSection(null);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    }
  }

  function handleAddSectionType(type) {
    if (!selectedPage) {
      setError('Selectionnez d\'abord une page.');
      return;
    }

    const def = getSectionDef(type);
    const defaultContent = getDefaultContent(type);
    const defaultSettings = getDefaultSettings(type);
    const defaultAnimation = def?.defaultAnimation || { type: 'none' };

    const newSection = {
      pageSlug: selectedPage.slug,
      pageId: selectedPage.id,
      type,
      name: def?.label || type,
      order: sections.length,
      isActive: true,
      content: defaultContent,
      settings: defaultSettings,
      animation: defaultAnimation,
      responsive: {},
      widgetTree: getDefaultWidgetTree(type),
    };

    setError('');
    setMessage('');
    createPageSection(newSection)
      .then((created) => {
        pageState.addServerSection(created);
        setAddingSection(false);
        setMessage('Section creee.');
      })
      .catch((err) => setError(err.message || 'Impossible de creer la section.'));
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
              <div
                key={page.id}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors ${
                  selectedPage?.id === page.id
                    ? 'bg-stone-900'
                    : 'hover:bg-stone-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectPage(page)}
                  className={`flex items-center gap-2 flex-1 text-left text-sm ${
                    selectedPage?.id === page.id
                      ? 'font-medium text-white'
                      : 'text-stone-600'
                  }`}
                >
                  <FileText size={14} />
                  <span className="flex-1 truncate">{page.title || page.slug}</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateAdminPage(page.id, { isPublished: !page.isPublished });
                      setPages((prev) =>
                        prev.map((p) =>
                          p.id === page.id ? { ...p, isPublished: !p.isPublished } : p
                        )
                      );
                      setMessage(`Page ${!page.isPublished ? 'publiee' : 'depubliee'}.`);
                    } catch (err) {
                      setError(err.message || 'Impossible de mettre a jour le statut de publication.');
                    }
                  }}
                  className={`flex-shrink-0 text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors ${
                    page.isPublished
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                  }`}
                  title={page.isPublished ? 'Depublier' : 'Publier'}
                >
                  {page.isPublished ? 'Publie' : 'Brouillon'}
                </button>
              </div>
            ))}
            {!pages.length && (
              <p className="py-4 text-center text-xs text-stone-400">Aucune page</p>
            )}
          </div>
        )}
      </div>

      {/* Main area - Sections */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm">
        {!selectedPage ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText size={40} className="text-stone-300" />
            <p className="mt-4 text-sm text-stone-500">Selectionnez une page pour voir ses sections</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl text-somacan-brand">{selectedPage.title || selectedPage.slug}</h3>
                <p className="text-xs text-stone-400">{sections.length} section(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadSections(selectedPage.slug)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  title="Rafraichir"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setAddingSection(true)}
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
                  <div
                    key={section.id}
                    className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 hover:border-stone-300 transition-colors"
                  >
                    {/* Drag handle visual */}
                    <div className="text-stone-300 flex-shrink-0">☰</div>

                    {/* Section info with inline editing */}
                    <div className="flex-1 min-w-0">
                      <SectionNameEditor
                        section={section}
                        onSave={(newName) => {
                          updatePageSection(section.id, { name: newName })
                            .then((updated) => {
                              pageState.applyServerSection(updated);
                              setMessage('Nom de la section mis a jour.');
                            })
                            .catch((err) => {
                              setError(err.message || 'Impossible de mettre a jour le nom.');
                            });
                        }}
                      />
                      <p className="text-xs text-stone-500 mt-0.5">{section.type}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Toggle visibility */}
                      <button
                        type="button"
                        onClick={() => handleToggleSection(section.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-white hover:text-stone-700 transition"
                        title={section.isActive ? 'Masquer' : 'Afficher'}
                      >
                        {section.isActive ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => setEditingSection(section)}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-white hover:text-stone-700 transition"
                        title="Editer"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => handleDuplicateSection(section)}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-white hover:text-stone-700 transition"
                        title="Dupliquer"
                      >
                        <Copy size={16} />
                      </button>

                      {/* Move up */}
                      <button
                        type="button"
                        onClick={() => handleMoveSection(section.id, 'up')}
                        disabled={sections.indexOf(section) === 0}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-white hover:text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="Monter"
                      >
                        <ChevronUp size={16} />
                      </button>

                      {/* Move down */}
                      <button
                        type="button"
                        onClick={() => handleMoveSection(section.id, 'down')}
                        disabled={sections.indexOf(section) === sections.length - 1}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-white hover:text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="Descendre"
                      >
                        <ChevronDown size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {!sections.length && (
                  <div className="rounded-2xl border-2 border-dashed border-stone-200 py-12 text-center">
                    <p className="text-sm text-stone-400">Aucune section. Cliquez sur "Ajouter une section" pour commencer.</p>
                  </div>
                )}
              </div>
            )}
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

      {/* Edit drawer */}
      {editingSection && (
        <EditSectionDrawer
          section={editingSection}
          pageSections={sections}
          onDraftChange={(patch) => pageState.updateDraftSection(editingSection.id, patch)}
          onResetDraft={() => pageState.resetDraftSection(editingSection.id)}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSection}
          error={error}
          setError={setError}
        />
      )}

      {/* Add section modal */}
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

function SectionNameEditor({ section, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(section.name);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === section.name) {
      setIsEditing(false);
      setName(section.name);
      return;
    }
    onSave(trimmedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(section.name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          className="text-sm font-medium text-stone-900 border border-stone-300 rounded px-2 py-1 focus:outline-none focus:border-stone-600 flex-1"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          className="p-1 text-stone-400 hover:text-emerald-600 transition"
          title="Enregistrer"
        >
          <Check size={14} />
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1 text-stone-400 hover:text-red-600 transition"
          title="Annuler"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <p
      onClick={() => setIsEditing(true)}
      className="text-sm font-medium text-stone-900 cursor-pointer hover:text-stone-700 transition"
      title="Cliquer pour editer"
    >
      {section.name}
    </p>
  );
}

function EditSectionDrawer({ section, pageSections, onDraftChange, onResetDraft, onClose, onSave, error, setError }) {
  const [content, setContent] = useState(section.content || {});
  const [settings, setSettings] = useState(section.settings || {});
  const [animation, setAnimation] = useState(section.animation || {});
  const [responsive, setResponsive] = useState(section.responsive || {});
  const [widgetTree, setWidgetTree] = useState(section.widgetTree || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContent(section.content || {});
    setSettings(section.settings || {});
    setAnimation(section.animation || {});
    setResponsive(section.responsive || {});
    setWidgetTree(section.widgetTree || []);
  }, [section]);

  useEffect(() => {
    onDraftChange({
      content,
      settings,
      animation,
      responsive,
      widgetTree,
    });
  }, [animation, content, onDraftChange, responsive, settings, widgetTree]);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await onSave({
        content,
        settings,
        animation,
        responsive,
        widgetTree,
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  const previewSections = pageSections.map((item) => (
    item.id === section.id
      ? {
        ...item,
        content,
        settings,
        animation,
        responsive,
        widgetTree,
      }
      : item
  ));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={() => {
          onResetDraft();
          onClose();
        }}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-[min(92rem,96vw)] bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div>
            <h2 className="font-display text-2xl text-somacan-brand">{section.name}</h2>
            <p className="text-xs text-stone-500 mt-1">{section.type}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onResetDraft();
              onClose();
            }}
            className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="grid flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="overflow-y-auto border-r border-stone-200">
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
          <div className="hidden overflow-y-auto bg-stone-50 p-4 lg:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Draft preview</p>
            <PreviewRenderer sections={previewSections} />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-6 py-4 bg-stone-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              onResetDraft();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-600 hover:bg-white transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-stone-900 text-sm font-bold text-white hover:bg-stone-800 disabled:opacity-50 transition flex items-center gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Enregistrer
          </button>
        </div>

        {error && (
          <div className="px-6 py-3 border-t border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function AddSectionModal({ templateKey, onClose, onSelectType }) {
  const templateDefinition = getTemplateDefinition(templateKey || 'custom');
  const allowedSectionTypes = templateDefinition.allowedSectionTypes || SECTION_TYPES;
  const visibleSectionTypes = SECTION_TYPES.filter((type) => allowedSectionTypes.includes(type));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-somacan-brand">Ajouter une section</h2>
            <p className="text-xs text-stone-500 mt-1">
              {templateDefinition.componentName} • {visibleSectionTypes.length} type(s) disponible(s)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:bg-stone-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Grid of section types */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visibleSectionTypes.map((type) => {
            const def = getSectionDef(type);
            if (!def) return null;

            return (
              <button
                key={type}
                type="button"
                onClick={() => onSelectType(type)}
                className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 transition text-left"
              >
                <div className="text-2xl mb-2">
                  {def.icon === 'sparkles' && '✨'}
                  {def.icon === 'arrow' && '→'}
                  {def.icon === 'globe' && '🌍'}
                  {def.icon === 'star' && '⭐'}
                  {def.icon === 'leaf' && '🌿'}
                  {def.icon === 'flask' && '⚗️'}
                  {def.icon === 'layout' && '▦'}
                  {def.icon === 'grid' && '▤'}
                  {def.icon === 'story' && '✦'}
                  {def.icon === 'testimonial' && '❝'}
                  {def.icon === 'faq' && '?'}
                  {def.icon === 'zap' && '⚡'}
                  {def.icon === 'heart' && '❤️'}
                  {def.icon === 'check' && '✓'}
                  {def.icon === 'sun' && '☀️'}
                  {def.icon === 'moon' && '🌙'}
                  {def.icon === 'shield' && '🛡️'}
                </div>
                <p className="text-sm font-bold text-stone-900">{def.label}</p>
                <p className="text-xs text-stone-500 mt-1">{type}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
