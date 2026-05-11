/**
 * PageRenderer.jsx
 *
 * Unified page renderer for CMS V2.
 * Renders a full page given page data: template + sections.
 * Supports both public pages and live preview.
 *
 * Props:
 *   page        — page object (title, slug, template, sections[], seo, etc.)
 *   previewMode — boolean (default false) — adds preview chrome if true
 *   onSectionClick — (section) => void — optional click handler for editor
 */

import React, { useMemo } from 'react';
import SectionRenderer from '../../components/cms/SectionRenderer';
import { buildPageConfig, getTemplateLayoutRules } from './TemplateEngine';
import { normalizeResponsiveConfig } from './ResponsiveEngine';

export default function PageRenderer({ page = {}, previewMode = false, onSectionClick }) {
  const config = useMemo(() => buildPageConfig(page), [page]);
  const sections = useMemo(() => {
    const raw = Array.isArray(page.sections) ? page.sections : [];
    return raw.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [page.sections]);

  const layoutRules = useMemo(() => getTemplateLayoutRules(page.template), [page.template]);

  // Template-level responsive class modifiers
  const templateResponsiveClass = useMemo(() => {
    const rules = config.responsiveRules || {};
    const classes = [];
    if (rules.mobileCollapse) classes.push('cms-template--mobile-collapse');
    if (rules.lockHeroPadding) classes.push('cms-template--lock-hero-padding');
    return classes.join(' ');
  }, [config]);

  // Compute page-level CSS variables from template config
  const pageStyle = useMemo(() => {
    const style = {};
    const templateConfig = page.templateConfig || {};
    if (templateConfig.maxContentWidth) {
      style['--cms-page-max-width'] = templateConfig.maxContentWidth;
    }
    style['--cms-page-base-spacing'] = templateConfig.baseSpacing || '3rem';
    return style;
  }, [page.templateConfig]);

  // Wrap sections with optional click handler for editor
  const renderSection = (section) => {
    const isLocked = section.templateLock && !previewMode;
    const isInactive = section.isActive === false;

    const sectionSpacing = section?.settings?.sectionGap || 'var(--cms-page-base-spacing)';
    const wrapperClasses = [
      'cms-page-section',
      isInactive ? 'cms-page-section--inactive' : '',
      isLocked ? 'cms-page-section--locked' : '',
      previewMode ? 'cms-page-section--preview' : '',
    ].filter(Boolean).join(' ');

    const content = (
      <div
        key={section.id || `${section.type}-${section.order ?? 0}`}
        className={wrapperClasses}
        data-section-id={section.id}
        data-section-type={section.type}
        style={{
          marginBottom: sectionSpacing,
          ...(isInactive ? { opacity: 0.4, pointerEvents: 'none' } : {}),
        }}
      >
        <SectionRenderer section={section} />
      </div>
    );

    if (onSectionClick) {
      return (
        <button
          type="button"
          key={section.id || `${section.type}-${section.order ?? 0}`}
          className={`${wrapperClasses} w-full text-left cursor-pointer hover:ring-2 hover:ring-[#033a22]/30 transition`}
          onClick={() => onSectionClick(section)}
          data-section-id={section.id}
          data-section-type={section.type}
          style={{ marginBottom: sectionSpacing }}
        >
          <SectionRenderer section={section} />
        </button>
      );
    }

    return content;
  };

  return (
    <article
      className={`cms-page ${templateResponsiveClass}`}
      data-template={page.template || 'custom'}
      data-preview={previewMode}
      style={pageStyle}
    >
      {/* Template layout wrapper */}
      <div
        className="cms-page__content"
        style={{
          ...(layoutRules.commerceAware ? { '--cms-commerce-aware': '1' } : {}),
          ...(layoutRules.editorialContext ? { '--cms-editorial-context': '1' } : {}),
        }}
      >
        {sections.map(renderSection)}
      </div>

      {/* Preview mode chrome */}
      {previewMode && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50">
          <div className="rounded-xl border border-stone-200 bg-white/90 px-3 py-2 text-xs font-medium text-stone-500 shadow-lg backdrop-blur">
            {config.templateDefinition?.label || 'Custom'}
            {' · '}
            {sections.length} section{sections.length !== 1 ? 's' : ''}
            {' · '}
            {page.isPublished ? 'Published' : 'Draft'}
          </div>
        </div>
      )}
    </article>
  );
}
