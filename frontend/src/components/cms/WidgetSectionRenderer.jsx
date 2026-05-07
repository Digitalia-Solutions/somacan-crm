import React, { useRef } from 'react';
import { isWidgetSectionType } from '../../../../shared/cms/sections.js';
import { resolvePresetStyle } from '../../cms/v2/GlobalStyleEngine';
import {
  buildResponsiveStyleVariables,
  buildResponsiveStylesheet,
  getResponsiveInlineStyle,
  getVisibilityClasses,
  buildResponsiveGridStylesheet,
} from '../../cms/v2/ResponsiveEngine';
import { renderWidget, renderWidgetTree, useWidgetTreeStagger } from '../../cms/v2/WidgetRegistry.jsx';
import { isGSAPAnimation } from '../../cms/AnimationEngine';
import useGSAPScrollAnimation, { useGSAPStaggerReveal } from '../../cms/v2/useGSAPScrollAnimation';

function getGridStyle(section) {
  const widgetCount = Array.isArray(section.widgetTree) ? section.widgetTree.length : 0;
  const columns = section.settings?.columns || Math.min(widgetCount, 3) || 1;

  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))`,
    gap: section.settings?.gap || '1.5rem',
  };
}

export default function WidgetSectionRenderer({ section }) {
  if (!isWidgetSectionType(section.type)) {
    return null;
  }

  const containerRef = useRef(null);
  const widgets = Array.isArray(section.widgetTree) ? section.widgetTree : [];
  const classToken = `cms-section-v2-${section.id || section.type}`;

  const sectionStyle = {
    ...resolvePresetStyle('section', section.settings?.presetId, section.globalStyleOverrides),
    ...(section.settings?.backgroundColor ? { backgroundColor: section.settings.backgroundColor } : {}),
    ...(section.settings?.contentWidth ? { ['--cms-content-width']: section.settings.contentWidth } : {}),
    ...buildResponsiveStyleVariables(section.responsive, `--${classToken}`),
    ...getResponsiveInlineStyle(section.responsive),
  };

  // Build responsive grid stylesheet
  const widgetCount = widgets.length;
  const desktopColumns = Math.min(parseInt(section.settings?.columns, 10) || Math.min(widgetCount, 3) || 1, widgetCount || 1);
  const gridStylesheet = buildResponsiveGridStylesheet(
    `${classToken}__grid`,
    section.responsive,
    desktopColumns,
    2,
    1
  );

  const baseStylesheet = `${buildResponsiveStylesheet(classToken, section.responsive, `--${classToken}`)}
.${classToken}__inner { width: min(100%, var(--cms-content-width, 1200px)); margin: 0 auto; }
${gridStylesheet}`;

  // GSAP stagger for widget tree if animation type is GSAP stagger variant
  const animationType = section.animation?.type || 'none';
  const isGSAPStagger = isGSAPAnimation(animationType) && animationType.includes('stagger');
  useGSAPStaggerReveal(containerRef, section.animation, '[data-stagger-item]', [widgets]);

  // GSAP section-level animation
  useGSAPScrollAnimation(containerRef, section.animation, [section.id, animationType]);

  return (
    <section
      ref={containerRef}
      className={`${classToken} ${getVisibilityClasses(section.responsive)}`.trim()}
      style={sectionStyle}
    >
      <style>{baseStylesheet}</style>
      <div className={`${classToken}__inner px-6 py-10`}>
        <div className={`${classToken}__grid`} style={getGridStyle(section)}>
          {widgets.map((widget) => (
            <div key={widget.id} data-stagger-item={isGSAPStagger ? '' : undefined}>
              {renderWidget(widget)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
