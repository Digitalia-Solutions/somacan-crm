import { useMemo, useState, useCallback } from 'react';

function cloneSections(sections = []) {
  return sections.map((section) => ({
    ...section,
    content: { ...(section.content || {}) },
    settings: { ...(section.settings || {}) },
    animation: { ...(section.animation || {}) },
    responsive: { ...(section.responsive || {}) },
    seo: { ...(section.seo || {}) },
    globalStyleOverrides: { ...(section.globalStyleOverrides || {}) },
    widgetTree: Array.isArray(section.widgetTree)
      ? section.widgetTree.map((widget) => ({
          ...widget,
          props: { ...(widget.props || {}) },
          style: { ...(widget.style || {}) },
          responsive: { ...(widget.responsive || {}) },
          animation: { ...(widget.animation || {}) },
        }))
      : section.widgetTree,
  }));
}

function sortSections(sections = []) {
  return [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * useCmsPageState
 *
 * Manages draft vs saved sections for a CMS page.
 * Supports template-aware defaults and dirty tracking.
 */
export default function useCmsPageState(initialSections = [], options = {}) {
  const { templateKey = 'custom' } = options;

  const [savedSections, setSavedSections] = useState(() => sortSections(cloneSections(initialSections)));
  const [draftSections, setDraftSections] = useState(() => sortSections(cloneSections(initialSections)));
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const isDirty = useMemo(() => {
    return JSON.stringify(draftSections) !== JSON.stringify(savedSections);
  }, [draftSections, savedSections]);

  const api = useMemo(() => ({
    savedSections,
    draftSections,
    isDirty,
    lastSavedAt,
    templateKey,

    replaceAll(sections) {
      const next = sortSections(cloneSections(sections));
      setSavedSections(next);
      setDraftSections(next);
    },

    applyServerSection(section) {
      const updater = (prev) => sortSections(prev.map((item) => (item.id === section.id ? section : item)));
      setSavedSections(updater);
      setDraftSections(updater);
      setLastSavedAt(Date.now());
    },

    addServerSection(section) {
      const updater = (prev) => sortSections([...prev, section]);
      setSavedSections(updater);
      setDraftSections(updater);
    },

    removeServerSection(sectionId) {
      const updater = (prev) => prev.filter((item) => item.id !== sectionId);
      setSavedSections(updater);
      setDraftSections(updater);
    },

    updateDraftSection(sectionId, patch) {
      setDraftSections((prev) =>
        prev.map((item) => (item.id === sectionId ? { ...item, ...patch } : item))
      );
    },

    resetDraftSection(sectionId) {
      setDraftSections((prev) =>
        prev.map((item) => {
          if (item.id !== sectionId) {
            return item;
          }
          const saved = savedSections.find((s) => s.id === sectionId);
          return saved ? cloneSections([saved])[0] : item;
        })
      );
    },

    resetAllDrafts() {
      setDraftSections(cloneSections(savedSections));
    },

    setDraftOrder(sections) {
      const next = sortSections(cloneSections(sections));
      setDraftSections(next);
    },

    markSaved() {
      setSavedSections(cloneSections(draftSections));
      setLastSavedAt(Date.now());
    },

    /**
     * Update a widget inside a section's widgetTree.
     */
    updateWidget(sectionId, widgetId, patch) {
      setDraftSections((prev) =>
        prev.map((section) => {
          if (section.id !== sectionId) return section;
          const widgetTree = Array.isArray(section.widgetTree) ? section.widgetTree : [];
          return {
            ...section,
            widgetTree: widgetTree.map((widget) =>
              widget.id === widgetId ? { ...widget, ...patch } : widget
            ),
          };
        })
      );
    },

    /**
     * Add a widget to a section's widgetTree.
     */
    addWidget(sectionId, widget) {
      setDraftSections((prev) =>
        prev.map((section) => {
          if (section.id !== sectionId) return section;
          const widgetTree = Array.isArray(section.widgetTree) ? section.widgetTree : [];
          return {
            ...section,
            widgetTree: [...widgetTree, widget],
          };
        })
      );
    },

    /**
     * Remove a widget from a section's widgetTree.
     */
    removeWidget(sectionId, widgetId) {
      setDraftSections((prev) =>
        prev.map((section) => {
          if (section.id !== sectionId) return section;
          const widgetTree = Array.isArray(section.widgetTree) ? section.widgetTree : [];
          return {
            ...section,
            widgetTree: widgetTree.filter((widget) => widget.id !== widgetId),
          };
        })
      );
    },

    /**
     * Reorder widgets inside a section.
     */
    reorderWidgets(sectionId, widgetIds) {
      setDraftSections((prev) =>
        prev.map((section) => {
          if (section.id !== sectionId) return section;
          const widgetTree = Array.isArray(section.widgetTree) ? section.widgetTree : [];
          const map = new Map(widgetTree.map((w) => [w.id, w]));
          return {
            ...section,
            widgetTree: widgetIds.map((id) => map.get(id)).filter(Boolean),
          };
        })
      );
    },
  }), [draftSections, savedSections, isDirty, lastSavedAt, templateKey]);

  return api;
}
