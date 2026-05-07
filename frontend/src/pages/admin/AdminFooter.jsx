import { useState, useEffect } from 'react';
import { getAdminFooterSettings, updateAdminFooterSettings } from '../../lib/api';
import { Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';

function Section({ title, children }) {
  return (
    <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm md:px-8 mb-6">
      <h3 className="font-display text-2xl text-somacan-brand mb-6">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminFooter() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getAdminFooterSettings()
      .then(data => setFooterData(data))
      .catch(err => {
        console.error('Failed to fetch footer settings:', err);
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
      await updateAdminFooterSettings(footerData);
      showMessage('success', 'Footer settings saved successfully!');
    } catch (err) {
      showMessage('error', err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!footerData) return <div className="text-center py-12">No data</div>;

  const updateField = (path, value) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(footerData));
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFooterData(newData);
  };

  const updateArrayItem = (path, index, field, value) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(footerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current[index][field] = value;
    setFooterData(newData);
  };

  const updateNestedArrayItem = (path, index, nestedIndex, field, value) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(footerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current[index].links[nestedIndex][field] = value;
    setFooterData(newData);
  };

  const addArrayItem = (path, item) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(footerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.push(item);
    setFooterData(newData);
  };

  const addNestedItem = (path, index, item) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(footerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current[index].links.push(item);
    setFooterData(newData);
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(footerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current.splice(index, 1);
    setFooterData(newData);
  };

  const removeNestedItem = (path, index, nestedIndex) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(footerData));
    let current = newData;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    current[index].links.splice(nestedIndex, 1);
    setFooterData(newData);
  };

  return (
    <div className="grid gap-6">
      {message && (
        <div className={`rounded-2xl px-6 py-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Logo & Description */}
      <Section title="Logo & Description">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Logo URL</label>
            <input
              type="text"
              value={footerData.logo?.src || ''}
              onChange={(e) => updateField('logo.src', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Alt Text</label>
            <input
              type="text"
              value={footerData.logo?.alt || ''}
              onChange={(e) => updateField('logo.alt', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Description</label>
            <textarea
              value={footerData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full h-24 rounded-xl border border-stone-200 px-4 py-2 text-sm"
            />
          </div>
        </div>
      </Section>

      {/* Columns */}
      <Section title="Colonnes de liens">
        <div className="space-y-6">
          {footerData.columns?.map((column, idx) => (
            <div key={idx} className="border border-stone-200 rounded-xl p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-stone-600 mb-2">Column Title</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={column.title || ''}
                    onChange={(e) => updateArrayItem('columns', idx, 'title', e.target.value)}
                    className="flex-1 h-10 rounded-xl border border-stone-200 px-4 text-sm"
                  />
                  <button
                    onClick={() => removeArrayItem('columns', idx)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-stone-600">Links</p>
                {column.links?.map((link, linkIdx) => (
                  <div key={linkIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => updateNestedArrayItem('columns', idx, linkIdx, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 h-10 rounded-xl border border-stone-200 px-4 text-sm"
                    />
                    <input
                      type="text"
                      value={link.href || ''}
                      onChange={(e) => updateNestedArrayItem('columns', idx, linkIdx, 'href', e.target.value)}
                      placeholder="URL"
                      className="flex-1 h-10 rounded-xl border border-stone-200 px-4 text-sm"
                    />
                    <button
                      onClick={() => removeNestedItem('columns', idx, linkIdx)}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addNestedItem('columns', idx, { label: 'New Link', href: '#' })}
                  className="text-sm text-somacan-brand hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('columns', { title: 'New Column', links: [] })}
            className="btn-luxury btn-luxury-outline w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Column
          </button>
        </div>
      </Section>

      {/* Social Links */}
      <Section title="Réseaux sociaux">
        <div className="space-y-4">
          {footerData.socials?.map((social, idx) => (
            <div key={idx} className="border border-stone-200 rounded-xl p-4 grid md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Platform</label>
                <input
                  type="text"
                  value={social.platform || ''}
                  onChange={(e) => updateArrayItem('socials', idx, 'platform', e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">URL</label>
                <input
                  type="text"
                  value={social.href || ''}
                  onChange={(e) => updateArrayItem('socials', idx, 'href', e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Icon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={social.icon || ''}
                    onChange={(e) => updateArrayItem('socials', idx, 'icon', e.target.value)}
                    maxLength="1"
                    className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                  />
                  <button
                    onClick={() => removeArrayItem('socials', idx)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('socials', { platform: 'New', href: '#', icon: 'N' })}
            className="btn-luxury btn-luxury-outline w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Social
          </button>
        </div>
      </Section>

      {/* Newsletter */}
      <Section title="Newsletter">
        <div className="grid gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={footerData.newsletter?.enabled || false}
              onChange={(e) => updateField('newsletter.enabled', e.target.checked)}
            />
            <span className="text-sm text-stone-600">Enable Newsletter Section</span>
          </label>
          {footerData.newsletter?.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Title</label>
                <input
                  type="text"
                  value={footerData.newsletter?.title || ''}
                  onChange={(e) => updateField('newsletter.title', e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Placeholder</label>
                <input
                  type="text"
                  value={footerData.newsletter?.placeholder || ''}
                  onChange={(e) => updateField('newsletter.placeholder', e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">Button Text</label>
                <input
                  type="text"
                  value={footerData.newsletter?.buttonText || ''}
                  onChange={(e) => updateField('newsletter.buttonText', e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
                />
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Email</label>
            <input
              type="email"
              value={footerData.contact?.email || ''}
              onChange={(e) => updateField('contact.email', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Phone</label>
            <input
              type="text"
              value={footerData.contact?.phone || ''}
              onChange={(e) => updateField('contact.phone', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Address</label>
            <input
              type="text"
              value={footerData.contact?.address || ''}
              onChange={(e) => updateField('contact.address', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
        </div>
      </Section>

      {/* Legal */}
      <Section title="Mentions légales">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Copyright Text</label>
            <input
              type="text"
              value={footerData.legal?.copyright || ''}
              onChange={(e) => updateField('legal.copyright', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-600 mb-2">Legal Links</p>
            <div className="space-y-2">
              {footerData.legal?.links?.map((link, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => {
                      const newData = JSON.parse(JSON.stringify(footerData));
                      newData.legal.links[idx].label = e.target.value;
                      setFooterData(newData);
                    }}
                    placeholder="Label"
                    className="flex-1 h-10 rounded-xl border border-stone-200 px-4 text-sm"
                  />
                  <input
                    type="text"
                    value={link.href || ''}
                    onChange={(e) => {
                      const newData = JSON.parse(JSON.stringify(footerData));
                      newData.legal.links[idx].href = e.target.value;
                      setFooterData(newData);
                    }}
                    placeholder="URL"
                    className="flex-1 h-10 rounded-xl border border-stone-200 px-4 text-sm"
                  />
                  <button
                    onClick={() => {
                      const newData = JSON.parse(JSON.stringify(footerData));
                      newData.legal.links.splice(idx, 1);
                      setFooterData(newData);
                    }}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newData = JSON.parse(JSON.stringify(footerData));
                  newData.legal.links.push({ label: 'New Link', href: '#' });
                  setFooterData(newData);
                }}
                className="text-sm text-somacan-brand hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Add Link
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Theme Colors */}
      <Section title="Couleurs">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Background Color</label>
            <input
              type="text"
              value={footerData.theme?.backgroundColor || '#000000'}
              onChange={(e) => updateField('theme.backgroundColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
              placeholder="#1c1917"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Text Color</label>
            <input
              type="text"
              value={footerData.theme?.textColor || '#999999'}
              onChange={(e) => updateField('theme.textColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
              placeholder="#d6d3d1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Heading Color</label>
            <input
              type="text"
              value={footerData.theme?.headingColor || '#ffffff'}
              onChange={(e) => updateField('theme.headingColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Accent Color</label>
            <input
              type="text"
              value={footerData.theme?.accentColor || '#d49a2e'}
              onChange={(e) => updateField('theme.accentColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-600 mb-2">Border Color</label>
            <input
              type="text"
              value={footerData.theme?.borderColor || 'rgba(255,255,255,0.10)'}
              onChange={(e) => updateField('theme.borderColor', e.target.value)}
              className="w-full h-10 rounded-xl border border-stone-200 px-4 text-sm"
              placeholder="rgba(255,255,255,0.10)"
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
          {saving ? 'Saving...' : 'Save Footer Settings'}
        </button>
      </div>
    </div>
  );
}
