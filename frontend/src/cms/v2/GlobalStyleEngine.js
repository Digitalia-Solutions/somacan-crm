import { BUILTIN_STYLE_PRESETS, getBuiltinStylePreset } from '../../../../shared/cms/stylePresets.js';

export function getStylePreset(scope, presetId) {
  if (!presetId) {
    return null;
  }
  return getBuiltinStylePreset(scope, presetId);
}

export function resolvePresetStyle(scope, presetId, inlineStyles = {}) {
  const preset = getStylePreset(scope, presetId);
  return {
    ...(preset?.styles || {}),
    ...(inlineStyles || {}),
  };
}

export function getBuiltInPresets(scope) {
  return BUILTIN_STYLE_PRESETS[scope] || [];
}

/**
 * Generate CSS custom properties for a preset scope.
 * Useful for injecting preset values as CSS variables for child inheritance.
 *
 * @param {string} scope — 'button' | 'card' | 'section' | 'typography'
 * @param {string} presetId
 * @param {string} prefix — CSS variable prefix (default: --cms-preset)
 * @returns {Object} style object with CSS variables
 */
export function generatePresetCSSVariables(scope, presetId, prefix = '--cms-preset') {
  const preset = getStylePreset(scope, presetId);
  if (!preset) return {};

  const vars = {};
  const styles = preset.styles || {};
  for (const [key, value] of Object.entries(styles)) {
    const varName = `${prefix}-${scope}-${kebabCase(key)}`;
    vars[varName] = value;
  }
  return vars;
}

/**
 * Merge multiple preset scopes into a single style object.
 * Useful for sections that need button + card + typography presets simultaneously.
 *
 * @param {Array<{scope: string, presetId: string}>} scopes
 * @returns {Object} Merged inline styles
 */
export function mergePresetStyles(scopes = []) {
  const merged = {};
  for (const { scope, presetId, inlineStyles } of scopes) {
    const resolved = resolvePresetStyle(scope, presetId, inlineStyles);
    Object.assign(merged, resolved);
  }
  return merged;
}

/**
 * Build a complete stylesheet string from preset CSS variables.
 * Injects into a scoped class.
 *
 * @param {string} className
 * @param {Array<{scope: string, presetId: string}>} scopes
 * @returns {string} CSS string
 */
export function buildPresetStylesheet(className, scopes = []) {
  if (!scopes.length) return '';

  const lines = [];
  for (const { scope, presetId } of scopes) {
    const vars = generatePresetCSSVariables(scope, presetId);
    for (const [varName, value] of Object.entries(vars)) {
      lines.push(`  ${varName}: ${value};`);
    }
  }

  if (!lines.length) return '';
  return `.${className} {\n${lines.join('\n')}\n}`;
}

/**
 * Convert camelCase to kebab-case.
 */
function kebabCase(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

/**
 * Get all available presets as a flat list for UI selectors.
 * @returns {Array<{id: string, label: string, scope: string}>}
 */
export function getAllPresetsFlat() {
  const list = [];
  for (const [scope, presets] of Object.entries(BUILTIN_STYLE_PRESETS)) {
    for (const preset of presets) {
      list.push({ ...preset, scope });
    }
  }
  return list;
}

/**
 * Find a preset by partial ID match (useful for fuzzy search).
 */
export function findPresetsByQuery(query = '') {
  const q = query.toLowerCase();
  return getAllPresetsFlat().filter(
    (p) =>
      p.id.toLowerCase().includes(q) ||
      p.label.toLowerCase().includes(q) ||
      p.scope.toLowerCase().includes(q)
  );
}
