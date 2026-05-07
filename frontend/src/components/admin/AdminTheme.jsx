import { useEffect, useState } from 'react';
import { getThemeSettings, updateThemeSettings } from '../../lib/api';
import { applyThemeToCssVars } from '../../hooks/useTheme';

export default function AdminTheme() {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      setLoading(true);
      const data = await getThemeSettings();
      setTheme(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!theme) return;
    try {
      setSaving(true);
      const saved = await updateThemeSettings(theme);
      applyThemeToCssVars(saved);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field, value) {
    setTheme(prev => ({
      ...prev,
      [field]: value
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-stone-500">Chargement...</p>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-600">Erreur de chargement des paramètres</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-8 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm md:px-8">
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8">
        {/* Colors Section */}
        <div>
          <h3 className="mb-4 font-display text-2xl text-stone-900">Couleurs</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Couleur primaire</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.primaryColor || '#033a22'}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-stone-200"
                />
                <input
                  type="text"
                  value={theme.primaryColor || '#033a22'}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm"
                  placeholder="#033a22"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Couleur secondaire</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.secondaryColor || '#1c1917'}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-stone-200"
                />
                <input
                  type="text"
                  value={theme.secondaryColor || '#1c1917'}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm"
                  placeholder="#1c1917"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Couleur d'accent</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.accentColor || '#d49a2e'}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-stone-200"
                />
                <input
                  type="text"
                  value={theme.accentColor || '#d49a2e'}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm"
                  placeholder="#d49a2e"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Couleur de fond</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.backgroundColor || '#fcfaf7'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-stone-200"
                />
                <input
                  type="text"
                  value={theme.backgroundColor || '#fcfaf7'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm"
                  placeholder="#fcfaf7"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Couleur du texte</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.textColor || '#1c1917'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-stone-200"
                />
                <input
                  type="text"
                  value={theme.textColor || '#1c1917'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm"
                  placeholder="#1c1917"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography Section */}
        <div>
          <h3 className="mb-4 font-display text-2xl text-stone-900">Typographie</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Police des titres</label>
              <input
                type="text"
                value={theme.headingFont || 'Aariana, serif'}
                onChange={(e) => handleChange('headingFont', e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
                placeholder="Aariana, serif"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Police du corps</label>
              <input
                type="text"
                value={theme.bodyFont || 'Manrope, sans-serif'}
                onChange={(e) => handleChange('bodyFont', e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
                placeholder="Manrope, sans-serif"
              />
            </div>
          </div>
        </div>

        {/* Layout Section */}
        <div>
          <h3 className="mb-4 font-display text-2xl text-stone-900">Mise en page</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Rayon de bordure</label>
              <input
                type="text"
                value={theme.borderRadius || '1rem'}
                onChange={(e) => handleChange('borderRadius', e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
                placeholder="1rem"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Largeur du conteneur</label>
              <input
                type="text"
                value={theme.containerWidth || '1400px'}
                onChange={(e) => handleChange('containerWidth', e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
                placeholder="1400px"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-stone-700">Padding de section</label>
              <input
                type="text"
                value={theme.sectionPadding || '6rem 2.5rem'}
                onChange={(e) => handleChange('sectionPadding', e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
                placeholder="6rem 2.5rem"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 border-t border-stone-200 pt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-luxury btn-luxury-primary flex items-center justify-center gap-2"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </button>
        </div>
      </div>
    </div>
  );
}
