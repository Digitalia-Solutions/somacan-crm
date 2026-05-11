import React, { useRef } from 'react';
import { isWidgetSectionType, getSectionDefinition } from '../../../../shared/cms/sections.js';
import { resolvePresetStyle } from '../../cms/v2/GlobalStyleEngine';
import {
  buildResponsiveStyleVariables,
  buildResponsiveStylesheet,
  getResponsiveInlineStyle,
  getVisibilityClasses,
  buildResponsiveGridStylesheet,
  buildResponsiveFlexStylesheet,
} from '../../cms/v2/ResponsiveEngine';
import { renderWidget } from '../../cms/v2/WidgetRegistry.jsx';
import { isGSAPAnimation } from '../../cms/AnimationEngine';
import useGSAPScrollAnimation, { useGSAPStaggerReveal } from '../../cms/v2/useGSAPScrollAnimation';

export default function WidgetSectionRenderer({ section }) {
  if (!isWidgetSectionType(section.type)) {
    return null;
  }

  const containerRef = useRef(null);
  const widgets = Array.isArray(section.widgetTree) ? section.widgetTree : [];
  const classToken = `cms-section-v2-${section.id || section.type}`;

  // Section base style with presets and overrides
  const sectionStyle = {
    ...resolvePresetStyle('section', section.settings?.presetId, section.settings?.styles),
    ...(section.settings?.backgroundColor ? { backgroundColor: section.settings.backgroundColor } : {}),
    ...((section.settings?.contentWidth || section.settings?.fullWidth === true)
      ? { ['--cms-content-width']: section.settings?.fullWidth === true ? '100%' : section.settings.contentWidth }
      : {}),
    ...buildResponsiveStyleVariables(section.responsive, `--${classToken}`),
    ...getResponsiveInlineStyle(section.responsive),
  };

  // Build responsive grid stylesheet
  const widgetCount = widgets.length;
  const sectionDef = getSectionDefinition(section.type);
  const layoutColumns = sectionDef?.layoutRules?.columns;
  const desktopColumns = parseInt(section.settings?.columns, 10) ||
    (typeof layoutColumns === 'number' ? layoutColumns : Math.min(widgetCount, 3)) || 1;
  const gridStylesheet = buildResponsiveGridStylesheet(
    `${classToken}__grid`,
    section.responsive,
    desktopColumns,
    Math.min(desktopColumns, 2),
    1
  );

  const baseStylesheet = `${buildResponsiveStylesheet(classToken, section.responsive, `--${classToken}`)}
.${classToken}__inner { width: min(100%, var(--cms-content-width, 1200px)); max-width: var(--cms-content-width, 1200px); margin: 0 auto; }
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
        <div className={`${classToken}__grid`} style={{ gap: section.settings?.gap || '1.5rem' }}>
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
