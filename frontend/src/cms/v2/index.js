/**
 * CMS V2 Architecture — Public API
 *
 * Import everything from the V2 architecture from a single entry point:
 *
 *   import {
 *     PageRenderer,
 *     WidgetRegistry,
 *     CmsPageProvider,
 *     useCmsPageContext,
 *     TemplateEngine,
 *     ResponsiveEngine,
 *     GlobalStyleEngine,
 *     AnimationEngine,
 *   } from './cms/v2';
 */

// Template System
export {
  validatePageAgainstTemplate,
  resolvePageSEO,
  getTemplateLayoutRules,
  enforceTemplateConstraints,
  getTemplateResponsiveRules,
  buildPageConfig,
  TEMPLATE_REGISTRY,
  getTemplateDefinition,
  isSectionAllowedForTemplate,
} from './TemplateEngine';

// Widget System
export {
  WIDGET_REGISTRY,
  WIDGET_TYPES,
  getWidgetDefinition,
  getWidgetDef,
  renderWidget,
  renderWidgetTree,
  useWidgetTreeStagger,
} from './WidgetRegistry.jsx';

export { default as WidgetRenderer, WidgetTreeRenderer } from './WidgetRenderer.jsx';

// Responsive Engine
export {
  normalizeResponsiveConfig,
  isDeviceVisible,
  getMediaQuery,
  getDeviceBreakpoint,
  getVisibilityClasses,
  buildResponsiveStyleVariables,
  getResponsiveInlineStyle,
  buildResponsiveStylesheet,
  buildResponsiveGridStylesheet,
  buildResponsiveFlexStylesheet,
  CMS_DEVICES,
  DEFAULT_DEVICE_RESPONSIVE,
} from './ResponsiveEngine';

export { default as StylePresetField } from '../fields/StylePresetField';

// Global Style Engine
export {
  getStylePreset,
  resolvePresetStyle,
  getBuiltInPresets,
  generatePresetCSSVariables,
  mergePresetStyles,
  buildPresetStylesheet,
  getAllPresetsFlat,
  findPresetsByQuery,
} from './GlobalStyleEngine';

// Animation Engine (re-export from parent for convenience)
export {
  FM_VARIANTS,
  GSAP_PRESETS,
  ANIMATION_TYPES,
  getFMVariants,
  isGSAPAnimation,
  toGSAPEase,
  getGSAPPreset,
  getAnimationLabel,
  getAnimationOptions,
} from '../AnimationEngine';

// GSAP Hook
export { default as useGSAPScrollAnimation, useGSAPStaggerReveal } from './useGSAPScrollAnimation';

// Live Preview Architecture
export { default as useCmsPageState } from './useCmsPageState';
export { CmsPageProvider, useCmsPageContext } from './CmsPageContext';
export { default as PageRenderer } from './PageRenderer';
export { default as PreviewRenderer } from './PreviewRenderer';
export { default as PageBuilderWrapper } from './PageBuilderWrapper';
