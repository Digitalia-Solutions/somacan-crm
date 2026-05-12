import { useEffect, useState } from 'react';
import { GripVertical, Loader2, Menu, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { createMenu, deleteMenu, getMenus, updateMenu } from '../../lib/api';

const DEFAULT_MENU_SETTINGS = {
  logo: '',
  stickyLogo: '',
  logoHeight: '48px',
  mobileLogoHeight: '40px',
  position: 'fixed',
  stickyEnabled: true,
  hideOnHomeTop: true,
  backgroundColor: 'rgba(255,255,255,0.72)',
  stickyBackgroundColor: 'rgba(255,255,255,0.90)',
  linkColor: '#043920B3',
  stickyLinkColor: '#043920',
  iconColor: '#043920',
  stickyIconColor: '#043920',
  mobileBackgroundColor: '#ffffff',
  shadowColor: 'rgba(28,25,23,0.08)',
  backdropBlur: '12px',
  topPadding: '16px',
  stickyTopPadding: '12px',
};

function parseJsonField(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeMenuData(menu) {
  if (!menu) return { items: [], settings: { ...DEFAULT_MENU_SETTINGS } };
  const parsedItems = parseJsonField(menu.items, []);

  if (Array.isArray(parsedItems)) {
    return { items: parsedItems, settings: { ...DEFAULT_MENU_SETTINGS } };
  }
  if (parsedItems && typeof parsedItems === 'object') {
    return {
      items: Array.isArray(parsedItems.items) ? parsedItems.items : [],
      settings: {
        ...DEFAULT_MENU_SETTINGS,
        ...(parsedItems.settings && typeof parsedItems.settings === 'object' ? parsedItems.settings : {}),
      },
    };
  }
  return { items: [], settings: { ...DEFAULT_MENU_SETTINGS } };
}

function buildMenuPayload(items, settings) {
  return {
    items,
    settings,
  };
}

function MenuItemRow({ item, onEdit, onDelete, onDragStart, onDragOver, onDrop }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, item)}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(e, item); }}
      onDrop={(e) => onDrop?.(e, item)}
      className="group flex items-center gap-3 rounded-xl border border-stone-200/60 bg-white px-3 py-2.5 transition-shadow hover:shadow-sm cursor-grab active:cursor-grabbing"
      style={{ marginLeft: `${(item.depth || 0) * 24}px` }}
    >
      <span className="flex-shrink-0 text-stone-300 group-hover:text-stone-500">
        <GripVertical size={14} />
      </span>
      <span className="flex-1 min-w-0 truncate text-sm text-stone-800">{item.label || 'Sans label'}</span>
      <span className="flex-shrink-0 max-w-[180px] truncate text-xs text-stone-400">{item.url || '#'}</span>
      <div className="flex-shrink-0 flex items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit?.(item)}
          className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <Pencil size={12} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(item)}
          className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function MenuItemEditor({ item, onSave, onCancel }) {
  const [label, setLabel] = useState(item?.label || '');
  const [url, setUrl] = useState(item?.url || '');
  const [target, setTarget] = useState(item?.target || '_self');

  function handleSave() {
    if (!label.trim()) return;
    onSave({ ...item, label: label.trim(), url: url.trim(), target });
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/about, https://..."
            className="mt-1 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Target</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm outline-none"
          >
            <option value="_self">Meme onglet</option>
            <option value="_blank">Nouvel onglet</option>
          </select>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-2 text-xs text-stone-500 hover:bg-stone-100"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800"
        >
          <Save size={12} />
          Enregistrer
        </button>
      </div>
    </div>
  );
}

export default function MenuBuilder() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [addingItem, setAddingItem] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [menuSettings, setMenuSettings] = useState(DEFAULT_MENU_SETTINGS);
  const [settingsTab, setSettingsTab] = useState('logo');

  useEffect(() => {
    setLoading(true);
    getMenus()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setMenus(list);
        if (list.length > 0 && !selectedMenuId) {
          setSelectedMenuId(list[0].id);
        }
      })
      .catch((err) => setError(err.message || 'Impossible de charger les menus.'))
      .finally(() => setLoading(false));
  }, []);

  const selectedMenu = menus.find((m) => m.id === selectedMenuId) || null;
  const menuItems = normalizeMenuData(selectedMenu).items;

  useEffect(() => {
    const normalized = normalizeMenuData(selectedMenu);
    setMenuSettings(normalized.settings);
  }, [selectedMenuId, selectedMenu]);

  function selectMenu(id) {
    setSelectedMenuId(id);
    setEditingItem(null);
    setAddingItem(false);
    setMessage('');
    setError('');
  }

  async function handleCreateMenu() {
    const name = window.prompt('Nom du menu :');
    if (!name || !name.trim()) return;

    setError('');
    try {
      const created = await createMenu({
        name: name.trim(),
        items: buildMenuPayload([], DEFAULT_MENU_SETTINGS),
      });
      setMenus((prev) => [...prev, created]);
      setSelectedMenuId(created.id);
      setMessage(`Menu "${created.name}" cree.`);
    } catch (err) {
      setError(err.message || 'Impossible de creer le menu.');
    }
  }

  async function handleDeleteMenu(id) {
    if (!window.confirm('Supprimer ce menu ?')) return;

    setError('');
    try {
      await deleteMenu(id);
      setMenus((prev) => prev.filter((m) => m.id !== id));
      if (selectedMenuId === id) {
        setSelectedMenuId(menus.find((m) => m.id !== id)?.id || null);
      }
      setMessage('Menu supprime.');
    } catch (err) {
      setError(err.message || 'Impossible de supprimer le menu.');
    }
  }

  async function saveMenuItems(updatedItems) {
    if (!selectedMenu) return;

    setError('');
    try {
      const saved = await updateMenu(selectedMenu.id, {
        ...selectedMenu,
        items: buildMenuPayload(updatedItems, menuSettings),
      });
      setMenus((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
      setMessage('Menu mis a jour.');
    } catch (err) {
      setError(err.message || 'Erreur de sauvegarde.');
    }
  }

  function handleSaveItem(itemData) {
    if (editingItem) {
      const updated = menuItems.map((it) => (it === editingItem ? itemData : it));
      saveMenuItems(updated);
      setEditingItem(null);
    } else {
      saveMenuItems([...menuItems, { ...itemData, depth: 0 }]);
      setAddingItem(false);
    }
  }

  function handleDeleteItem(item) {
    if (!window.confirm(`Supprimer "${item.label}" ?`)) return;
    const updated = menuItems.filter((it) => it !== item);
    saveMenuItems(updated);
  }

  async function handleSaveSettings() {
    if (!selectedMenu) return;

    setError('');
    try {
      const saved = await updateMenu(selectedMenu.id, {
        ...selectedMenu,
        items: buildMenuPayload(menuItems, menuSettings),
      });
      setMenus((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
      setMessage('Style du menu mis a jour.');
    } catch (err) {
      setError(err.message || 'Impossible de sauvegarder le style du menu.');
    }
  }

  // Drag & drop reorder
  function onDragStart(e, item) {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e, targetItem) {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetItem) {
      setDraggedItem(null);
      return;
    }

    const fromIdx = menuItems.indexOf(draggedItem);
    const toIdx = menuItems.indexOf(targetItem);
    if (fromIdx === -1 || toIdx === -1) {
      setDraggedItem(null);
      return;
    }

    const reordered = [...menuItems];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    saveMenuItems(reordered);
    setDraggedItem(null);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Left sidebar - Menu list */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Menus</h3>
          <button
            type="button"
            onClick={handleCreateMenu}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            title="Nouveau menu"
          >
            <Plus size={14} />
          </button>
        </div>

        {loading ? (
          <div className="mt-4 flex justify-center">
            <Loader2 size={18} className="animate-spin text-stone-400" />
          </div>
        ) : (
          <div className="mt-3 grid gap-1">
            {menus.map((menu) => (
              <div key={menu.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => selectMenu(menu.id)}
                  className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedMenuId === menu.id
                      ? 'bg-stone-900 font-medium text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Menu size={14} />
                  <span className="truncate">{menu.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMenu(menu.id)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {!menus.length && (
              <p className="py-4 text-center text-xs text-stone-400">Aucun menu</p>
            )}
          </div>
        )}
      </div>

      {/* Main area - Menu items */}
      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm">
        {!selectedMenu ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Menu size={40} className="text-stone-300" />
            <p className="mt-4 text-sm text-stone-500">Selectionnez un menu pour modifier ses elements</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl text-somacan-brand">{selectedMenu.name}</h3>
                <p className="text-xs text-stone-400">{menuItems.length} element(s)</p>
              </div>
              <button
                type="button"
                onClick={() => { setAddingItem(true); setEditingItem(null); }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800"
              >
                <Plus size={14} />
                Ajouter un element
              </button>
            </div>

            <div className="mt-5 grid gap-2">
              {menuItems.map((item, idx) => (
                editingItem === item ? (
                  <MenuItemEditor
                    key={idx}
                    item={item}
                    onSave={handleSaveItem}
                    onCancel={() => setEditingItem(null)}
                  />
                ) : (
                  <MenuItemRow
                    key={idx}
                    item={item}
                    onEdit={(it) => { setEditingItem(it); setAddingItem(false); }}
                    onDelete={handleDeleteItem}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                  />
                )
              ))}
              {!menuItems.length && !addingItem && (
                <div className="rounded-2xl border-2 border-dashed border-stone-200 py-12 text-center">
                  <p className="text-sm text-stone-400">Aucun element. Cliquez sur "Ajouter un element".</p>
                </div>
              )}
            </div>

            {addingItem && (
              <div className="mt-3">
                <MenuItemEditor
                  item={null}
                  onSave={handleSaveItem}
                  onCancel={() => setAddingItem(false)}
                />
              </div>
            )}

            <div className="mt-8 rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Apparence du menu</p>
                  <h4 className="mt-1 font-display text-2xl text-somacan-brand">Controle du header</h4>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800"
                >
                  <Save size={14} />
                  Enregistrer le style
                </button>
              </div>

              <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-1.5">
                {[
                  ['logo', 'Logo'],
                  ['layout', 'Layout'],
                  ['sticky', 'Sticky'],
                  ['colors', 'Colors'],
                  ['mobile', 'Mobile'],
                  ['advanced', 'Advanced'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSettingsTab(key)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                      settingsTab === key ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid gap-5">
                {settingsTab === 'logo' && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Logos</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Logo normal</label>
                      <input
                        value={menuSettings.logo}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, logo: e.target.value }))}
                        placeholder="https://... ou /asset/..."
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Logo sticky</label>
                      <input
                        value={menuSettings.stickyLogo}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, stickyLogo: e.target.value }))}
                        placeholder="https://... ou /asset/..."
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Hauteur logo desktop</label>
                      <input
                        value={menuSettings.logoHeight}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, logoHeight: e.target.value }))}
                        placeholder="48px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Hauteur logo mobile</label>
                      <input
                        value={menuSettings.mobileLogoHeight}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, mobileLogoHeight: e.target.value }))}
                        placeholder="40px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
                )}

                {settingsTab === 'layout' && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Layout & Typographie</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Position</label>
                      <select
                        value={menuSettings.position}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, position: e.target.value }))}
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      >
                        <option value="fixed">fixed</option>
                        <option value="sticky">sticky</option>
                        <option value="absolute">absolute</option>
                        <option value="relative">relative</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Largeur max container</label>
                      <input
                        value={menuSettings.navMaxWidth}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, navMaxWidth: e.target.value }))}
                        placeholder="100% ou 1440px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Gap entre liens</label>
                      <input
                        value={menuSettings.navItemGap}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, navItemGap: e.target.value }))}
                        placeholder="40px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Taille texte liens</label>
                      <input
                        value={menuSettings.navFontSize}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, navFontSize: e.target.value }))}
                        placeholder="11px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Letter spacing</label>
                      <input
                        value={menuSettings.navLetterSpacing}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, navLetterSpacing: e.target.value }))}
                        placeholder="0.3em"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Taille icones</label>
                      <input
                        value={menuSettings.iconSize}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, iconSize: e.target.value }))}
                        placeholder="20px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
                )}

                {settingsTab === 'sticky' && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Comportement sticky</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Blur fond</label>
                      <input
                        value={menuSettings.backdropBlur}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, backdropBlur: e.target.value }))}
                        placeholder="12px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Padding normal</label>
                      <input
                        value={menuSettings.topPadding}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, topPadding: e.target.value }))}
                        placeholder="16px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Padding sticky</label>
                      <input
                        value={menuSettings.stickyTopPadding}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, stickyTopPadding: e.target.value }))}
                        placeholder="12px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={menuSettings.stickyEnabled}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, stickyEnabled: e.target.checked }))}
                      />
                      Activer le mode sticky au scroll
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={menuSettings.hideOnHomeTop}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, hideOnHomeTop: e.target.checked }))}
                      />
                      Cacher le menu en haut de la home
                    </label>
                  </div>
                </div>
                )}

                {settingsTab === 'colors' && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Couleurs</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {[
                      ['backgroundColor', 'Fond normal'],
                      ['stickyBackgroundColor', 'Fond sticky'],
                      ['mobileBackgroundColor', 'Fond mobile'],
                      ['linkColor', 'Couleur liens'],
                      ['stickyLinkColor', 'Couleur liens sticky'],
                      ['iconColor', 'Couleur icones'],
                      ['stickyIconColor', 'Couleur icones sticky'],
                      ['hoverBackgroundColor', 'Fond hover icones'],
                      ['shadowColor', 'Couleur ombre'],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</label>
                        <input
                          value={menuSettings[key]}
                          onChange={(e) => setMenuSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder="#ffffff ou rgba(...)"
                          className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {settingsTab === 'mobile' && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Mobile menu</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Taille texte mobile</label>
                      <input
                        value={menuSettings.mobileNavFontSize}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, mobileNavFontSize: e.target.value }))}
                        placeholder="40px"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Fond mobile</label>
                      <input
                        value={menuSettings.mobileBackgroundColor}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, mobileBackgroundColor: e.target.value }))}
                        placeholder="#ffffff"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
                )}

                {settingsTab === 'advanced' && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Advanced</p>
                  <div className="mt-4 grid gap-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">Classes custom header</label>
                      <input
                        value={menuSettings.customClasses}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, customClasses: e.target.value }))}
                        placeholder="ex: mix-blend-difference"
                        className="mt-2 h-11 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">CSS scope custom</label>
                      <textarea
                        value={menuSettings.customCss}
                        onChange={(e) => setMenuSettings((prev) => ({ ...prev, customCss: e.target.value }))}
                        placeholder={'& {\n  border-bottom: 1px solid rgba(255,255,255,.1);\n}\n\n& a {\n  text-transform: uppercase;\n}'}
                        rows={10}
                        className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Feedback */}
        {message && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
