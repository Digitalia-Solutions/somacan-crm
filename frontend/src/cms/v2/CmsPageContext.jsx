/**
 * CmsPageContext.jsx
 *
 * React Context for centralized CMS page state.
 * Supports live preview with draft/saved separation, dirty tracking,
 * template awareness, and batch updates.
 *
 * Usage:
 *   <CmsPageProvider initialPage={pageData}>
 *     <PageEditor />
 *   </CmsPageProvider>
 */

import React, { createContext, useContext, useMemo, useCallback, useState, useRef } from 'react';
import useCmsPageState from './useCmsPageState';
import { buildPageConfig } from './TemplateEngine';

const CmsPageContext = createContext(null);

export function useCmsPageContext() {
  const ctx = useContext(CmsPageContext);
  if (!ctx) {
    throw new Error('useCmsPageContext must be used inside <CmsPageProvider>');
  }
  return ctx;
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(deepClone);
  const cloned = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone(obj[key]);
  }
  return cloned;
}

/**
 * CmsPageProvider
 *
 * Props:
 *   initialPage     — full page object from API (includes sections array)
 *   onSavePage      — (pagePatch) => Promise<updatedPage>
 *   onSaveSection   — (sectionId, sectionPatch) => Promise<updatedSection>
 *   children
 */
export function CmsPageProvider({
  initialPage = null,
  onSavePage = null,
  onSaveSection = null,
  children,
}) {
  const [pageMeta, setPageMeta] = useState(() => deepClone(initialPage || {}));
  const pageConfig = useMemo(() => buildPageConfig(pageMeta), [pageMeta]);

  // Section state via existing hook
  const sectionState = useCmsPageState(initialPage?.sections || []);

  // History stack for undo/redo (limit 50)
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const isDirty = useMemo(() => {
    return JSON.stringify(sectionState.draftSections) !== JSON.stringify(sectionState.savedSections);
  }, [sectionState.draftSections, sectionState.savedSections]);

  // ── Page metadata updates ──
  const updatePageMeta = useCallback((patch) => {
    setPageMeta((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateTemplate = useCallback((templateKey) => {
    setPageMeta((prev) => ({ ...prev, template: templateKey }));
  }, []);

  // ── History (undo/redo) ──
  const pushHistory = useCallback((sectionsSnapshot) => {
    const next = sectionsSnapshot.map((s) => deepClone(s));
    const history = historyRef.current;
    const idx = historyIndexRef.current;

    // Truncate any redo states
    if (idx < history.length - 1) {
      historyRef.current = history.slice(0, idx + 1);
    }

    historyRef.current.push(next);
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current += 1;
    }

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const snapshot = historyRef.current[historyIndexRef.current];
    sectionState.replaceAll(snapshot.map((s) => deepClone(s)));
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [sectionState]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const snapshot = historyRef.current[historyIndexRef.current];
    sectionState.replaceAll(snapshot.map((s) => deepClone(s)));
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, [sectionState]);

  // ── Section batch operations ──
  const batchUpdateSections = useCallback((updater) => {
    const next = updater(sectionState.draftSections.map((s) => deepClone(s)));
    sectionState.setDraftOrder(next);
  }, [sectionState]);

  // ── Save wrappers ──
  const savePageMeta = useCallback(async () => {
    if (!onSavePage) return null;
    const saved = await onSavePage({
      title: pageMeta.title,
      slug: pageMeta.slug,
      description: pageMeta.description,
      template: pageMeta.template,
      metaTitle: pageMeta.metaTitle,
      metaDescription: pageMeta.metaDescription,
      ogImage: pageMeta.ogImage,
      canonicalUrl: pageMeta.canonicalUrl,
      templateConfig: pageMeta.templateConfig,
    });
    setPageMeta((prev) => ({ ...prev, ...saved }));
    return saved;
  }, [onSavePage, pageMeta]);

  const saveSection = useCallback(async (sectionId, patch) => {
    if (!onSaveSection) return null;
    const saved = await onSaveSection(sectionId, patch);
    sectionState.applyServerSection(saved);
    return saved;
  }, [onSaveSection, sectionState]);

  // ── Value ──
  const value = useMemo(() => ({
    // Page
    pageMeta,
    pageConfig,
    updatePageMeta,
    updateTemplate,
    savePageMeta,

    // Sections
    sections: sectionState.draftSections,
    savedSections: sectionState.savedSections,
    isDirty,

    // Section operations
    replaceAllSections: sectionState.replaceAll,
    addSection: sectionState.addServerSection,
    removeSection: sectionState.removeServerSection,
    updateSection: sectionState.updateDraftSection,
    resetSection: sectionState.resetDraftSection,
    setSectionOrder: sectionState.setDraftOrder,
    applyServerSection: sectionState.applyServerSection,
    saveSection,
    batchUpdateSections,

    // History
    canUndo,
    canRedo,
    undo,
    redo,
    pushHistory,
  }), [
    pageMeta, pageConfig, updatePageMeta, updateTemplate, savePageMeta,
    sectionState, isDirty, saveSection, batchUpdateSections,
    canUndo, canRedo, undo, redo, pushHistory,
  ]);

  return (
    <CmsPageContext.Provider value={value}>
      {children}
    </CmsPageContext.Provider>
  );
}

export default CmsPageContext;
