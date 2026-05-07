import { useState, useEffect } from 'react';
import { getAdminHeaderSettings, updateAdminHeaderSettings } from '../../lib/api';
import { Trash2, ChevronUp, ChevronDown, Plus } from 'lucide-react';

function Section({ title, children }) {
  return (
    <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm md:px-8 mb-6">
      <h3 className="font-display text-2xl text-somacan-brand mb-6">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminHeader() {
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getAdminHeaderSettings()
      .then(data => setHeaderData(data))
      .catch(err => {
        console.error('Failed to fetch header settings:', err);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      })
      .finally(() => setLoading(false));
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminHeaderSettings(headerData);
      showMessage('success', 'Header settings saved successfully!');
    } catch (err) {
      showMessage('error', err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!headerData) return <div className="text-center py-12">No data</div>;

  const updateField = (path, value) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(headerData));
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setHeaderData(newData);
  };

  const updateArrayItem = (path, index, field, value) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(headerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current[index][field] = value;
    setHeaderData(newData);
  };

  const addArrayItem = (path, item) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(headerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.push(item);
    setHeaderData(newData);
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(headerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.splice(index, 1);
    setHeaderData(newData);
  };

  const moveArrayItem = (path, index, direction) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(headerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [current[index], current[newIndex]] = [current[newIndex], current[index]];
    setHeaderData(newData);
  };

  return (
    <div className="grid gap-6">
      {message && (
        <div className={`rounded-2xl px-6 py-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Logo */}
      <Section title="Logo">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Logo URL</label>
            <input
              type="text"
              value={headerData.logo?.src || ''}
              onChange={(e) => updateField('logo.src', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Alt Text</label>
            <input
              type="text"
              value={headerData.logo?.alt || ''}
              onChange={(e) => updateField('logo.alt', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Width (px)</label>
            <input
              type="number"
              value={headerData.logo?.width || 180}
              onChange={(e) => updateField('logo.width', parseInt(e.target.value))}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
        </div>
      </Section>

      {/* Navigation Links */}
      <Section title="Navigation Links">
        <div className="space-y-4">
          {headerData.navLinks?.map((item, idx) => (
            <div key={idx} className="border border-stone-200 rounded-xl p-4 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => updateArrayItem('navLinks', idx, 'label', e.target.value)}
                    className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">URL</label>
                  <input
                    type="text"
                    value={item.href || ''}
                    onChange={(e) => updateArrayItem('navLinks', idx, 'href', e.target.value)}
                    className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.isExternal || false}
                    onChange={(e) => updateArrayItem('navLinks', idx, 'isExternal', e.target.checked)}
                  />
                  <span className="text-sm text-stone-600">External link</span>
                </label>
                <div className="flex gap-2 ml-auto">
                  {idx > 0 && (
                    <button
                      onClick={() => moveArrayItem('navLinks', idx, 'up')}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>
                  )}
                  {idx < headerData.navLinks.length - 1 && (
                    <button
                      onClick={() => moveArrayItem('navLinks', idx, 'down')}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => removeArrayItem('navLinks', idx)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('navLinks', { label: 'New Link', href: '#', isExternal: false })}
            className="btn-luxury btn-luxury-outline w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>
      </Section>

      {/* CTA Button */}
      <Section title="Call-to-Action Button">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Label (empty to hide)</label>
            <input
              type="text"
              value={headerData.ctaButton?.label || ''}
              onChange={(e) => updateField('ctaButton.label', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">URL</label>
            <input
              type="text"
              value={headerData.ctaButton?.href || ''}
              onChange={(e) => updateField('ctaButton.href', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Variant</label>
            <select
              value={headerData.ctaButton?.variant || 'primary'}
              onChange={(e) => updateField('ctaButton.variant', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            >
              <option value="primary">Primary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
        </div>
      </Section>

      {/* Comportement */}
      <Section title="Comportement">
        <div className="grid gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={headerData.settings?.sticky || false}
              onChange={(e) => updateField('settings.sticky', e.target.checked)}
            />
            <span className="text-sm text-stone-600">Sticky Header</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={headerData.settings?.transparent || false}
              onChange={(e) => updateField('settings.transparent', e.target.checked)}
            />
            <span className="text-sm text-stone-600">Transparent at Top (Home only)</span>
          </label>
          {headerData.settings?.transparent && (
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">Transparent Scroll Threshold (px)</label>
              <input
                type="number"
                value={headerData.settings?.transparentScrollThreshold || 50}
                onChange={(e) => updateField('settings.transparentScrollThreshold', parseInt(e.target.value))}
                className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
              />
            </div>
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={headerData.settings?.hideOnHomeTop || false}
              onChange={(e) => updateField('settings.hideOnHomeTop', e.target.checked)}
            />
            <span className="text-sm text-stone-600">Hide on Home Page (until scroll)</span>
          </label>
        </div>
      </Section>

      {/* Theme Colors */}
      <Section title="Couleurs">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Background Color</label>
            <input
              type="color"
              value={headerData.theme?.backgroundColor || '#ffffff'}
              onChange={(e) => updateField('theme.backgroundColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Sticky Background Color</label>
            <input
              type="color"
              value={headerData.theme?.stickyBackgroundColor || '#ffffff'}
              onChange={(e) => updateField('theme.stickyBackgroundColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Text Color</label>
            <input
              type="color"
              value={headerData.theme?.textColor || '#000000'}
              onChange={(e) => updateField('theme.textColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Sticky Text Color</label>
            <input
              type="color"
              value={headerData.theme?.stickyTextColor || '#000000'}
              onChange={(e) => updateField('theme.stickyTextColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Icon Color</label>
            <input
              type="color"
              value={headerData.theme?.iconColor || '#000000'}
              onChange={(e) => updateField('theme.iconColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Sticky Icon Color</label>
            <input
              type="color"
              value={headerData.theme?.stickyIconColor || '#000000'}
              onChange={(e) => updateField('theme.stickyIconColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Mobile Background Color</label>
            <input
              type="color"
              value={headerData.theme?.mobileBackgroundColor || '#ffffff'}
              onChange={(e) => updateField('theme.mobileBackgroundColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Backdrop Blur</label>
            <input
              type="text"
              value={headerData.theme?.backdropBlur || '12px'}
              onChange={(e) => updateField('theme.backdropBlur', e.target.value)}
              placeholder="e.g. 12px"
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Shadow Color</label>
            <input
              type="text"
              value={headerData.theme?.shadowColor || 'rgba(0,0,0,0.1)'}
              onChange={(e) => updateField('theme.shadowColor', e.target.value)}
              placeholder="e.g. rgba(0,0,0,0.1)"
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
        </div>
      </Section>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-luxury btn-luxury-primary"
        >
          {saving ? 'Saving...' : 'Save Header Settings'}
        </button>
      </div>
    </div>
  );
}
