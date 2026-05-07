import { useState, useEffect } from 'react';
import { getMenus, createMenu, updateMenu, deleteMenu, getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../lib/api';
import { Plus, Trash2, ChevronRight, Globe, Link2, Edit3, X, Check } from 'lucide-react';

// Item form state defaults
const ITEM_DEFAULTS = { label: '', url: '/', type: 'internal', target: '_self', parentId: null };

export default function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [creatingMenu, setCreatingMenu] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // item being edited
  const [itemForm, setItemForm] = useState(ITEM_DEFAULTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(ITEM_DEFAULTS);

  // Load menus
  useEffect(() => {
    setLoadingMenus(true);
    getMenus()
      .then(data => {
        const list = Array.isArray(data) ? data : (data.menus || []);
        setMenus(list);
        if (list.length > 0 && !selectedMenu) setSelectedMenu(list[0]);
      })
      .catch(() => setMenus([]))
      .finally(() => setLoadingMenus(false));
  }, []);

  // Load items when menu selected
  useEffect(() => {
    if (!selectedMenu) return;
    setLoadingItems(true);
    getMenuItems(selectedMenu.id)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoadingItems(false));
  }, [selectedMenu]);

  async function handleCreateMenu(e) {
    e.preventDefault();
    if (!newMenuName.trim()) return;
    setCreatingMenu(true);
    try {
      const menu = await createMenu({ name: newMenuName.trim(), isActive: true });
      setMenus(prev => [...prev, menu]);
      setNewMenuName('');
      setSelectedMenu(menu);
    } catch (err) {
      console.error(err.message);
    } finally {
      setCreatingMenu(false);
    }
  }

  async function handleDeleteMenu(id) {
    if (!window.confirm('Supprimer ce menu et tous ses éléments ?')) return;
    try {
      await deleteMenu(id);
      setMenus(prev => prev.filter(m => m.id !== id));
      if (selectedMenu?.id === id) {
        const remaining = menus.filter(m => m.id !== id);
        setSelectedMenu(remaining[0] || null);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleAddItem(e) {
    e.preventDefault();
    if (!addForm.label.trim() || !selectedMenu) return;
    try {
      const item = await createMenuItem({
        ...addForm,
        menuId: selectedMenu.id,
        order: items.length,
      });
      setItems(prev => [...prev, item]);
      setAddForm(ITEM_DEFAULTS);
      setShowAddForm(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleSaveItem(id) {
    try {
      const updated = await updateMenuItem(id, itemForm);
      setItems(prev => prev.map(i => i.id === id ? updated : i));
      setEditingItem(null);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function handleDeleteItem(id) {
    if (!window.confirm('Supprimer cet élément (et ses sous-éléments) ?')) return;
    try {
      await deleteMenuItem(id);
      setItems(prev => prev.filter(i => i.id !== id && i.parentId !== id));
    } catch (err) {
      console.error(err.message);
    }
  }

  // Build tree: top-level items, then children
  const topLevel = items.filter(i => !i.parentId).sort((a, b) => a.order - b.order);
  const children = (parentId) => items.filter(i => i.parentId === parentId).sort((a, b) => a.order - b.order);

  function renderItem(item, depth = 0) {
    const isEditing = editingItem === item.id;
    return (
      <div key={item.id} className={`${depth > 0 ? 'ml-6 border-l border-stone-200 pl-4' : ''}`}>
        {isEditing ? (
          <div className="flex items-center gap-2 py-2 px-3 bg-stone-50 rounded-xl mb-1">
            <input value={itemForm.label} onChange={e => setItemForm(p => ({ ...p, label: e.target.value }))}
              className="flex-1 h-8 rounded-lg border border-stone-200 px-2 text-sm outline-none" placeholder="Label" />
            <input value={itemForm.url} onChange={e => setItemForm(p => ({ ...p, url: e.target.value }))}
              className="flex-1 h-8 rounded-lg border border-stone-200 px-2 text-sm outline-none" placeholder="URL" />
            <select value={itemForm.target} onChange={e => setItemForm(p => ({ ...p, target: e.target.value }))}
              className="h-8 rounded-lg border border-stone-200 px-2 text-sm outline-none">
              <option value="_self">Même onglet</option>
              <option value="_blank">Nouvel onglet</option>
            </select>
            <button onClick={() => handleSaveItem(item.id)} className="w-8 h-8 rounded-lg bg-[#033a22] text-white flex items-center justify-center hover:bg-[#033a22]/80 transition">
              <Check size={14} />
            </button>
            <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-stone-50 group mb-1 transition">
            {item.target === '_blank' ? <Globe size={13} className="text-stone-400 shrink-0" /> : <Link2 size={13} className="text-stone-400 shrink-0" />}
            <span className="flex-1 text-sm font-medium text-stone-800">{item.label}</span>
            <span className="text-xs text-stone-400 truncate max-w-[120px]">{item.url}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => { setEditingItem(item.id); setItemForm({ label: item.label, url: item.url, type: item.type, target: item.target, parentId: item.parentId }); }}
                className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition">
                <Edit3 size={12} className="text-stone-500" />
              </button>
              <button onClick={() => handleDeleteItem(item.id)}
                className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 transition">
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          </div>
        )}
        {children(item.id).map(child => renderItem(child, depth + 1))}
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-[300px_1fr] gap-6">
      {/* Menus list */}
      <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm xl:sticky xl:top-28 xl:self-start">
        <h3 className="font-display text-xl text-somacan-brand mb-4">Menus</h3>

        {loadingMenus ? (
          <p className="text-sm text-stone-400">Chargement...</p>
        ) : (
          <div className="space-y-1 mb-4">
            {menus.map(menu => (
              <button
                key={menu.id}
                onClick={() => setSelectedMenu(menu)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition ${
                  selectedMenu?.id === menu.id ? 'bg-stone-900 text-white' : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span>{menu.name}</span>
                <div className="flex items-center gap-2">
                  {selectedMenu?.id === menu.id && <ChevronRight size={14} />}
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteMenu(menu.id); }}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleCreateMenu} className="flex gap-2">
          <input
            value={newMenuName}
            onChange={e => setNewMenuName(e.target.value)}
            placeholder="Nom du menu..."
            className="flex-1 h-10 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm outline-none"
          />
          <button type="submit" disabled={creatingMenu} className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition">
            <Plus size={16} />
          </button>
        </form>
      </div>

      {/* Items editor */}
      <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm">
        {!selectedMenu ? (
          <div className="flex items-center justify-center h-40 text-stone-400 text-sm">Sélectionnez ou créez un menu</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Menu</p>
                <h3 className="font-display text-2xl text-somacan-brand">{selectedMenu.name}</h3>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
              >
                <Plus size={14} />
                Ajouter un lien
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddItem} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-stone-50 rounded-2xl">
                <input value={addForm.label} onChange={e => setAddForm(p => ({ ...p, label: e.target.value }))}
                  placeholder="Label *" required
                  className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none" />
                <input value={addForm.url} onChange={e => setAddForm(p => ({ ...p, url: e.target.value }))}
                  placeholder="URL (ex: /shop)"
                  className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none" />
                <select value={addForm.target} onChange={e => setAddForm(p => ({ ...p, target: e.target.value }))}
                  className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none">
                  <option value="_self">Même onglet</option>
                  <option value="_blank">Nouvel onglet</option>
                </select>
                <select value={addForm.parentId || ''} onChange={e => setAddForm(p => ({ ...p, parentId: e.target.value ? Number(e.target.value) : null }))}
                  className="h-10 rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none">
                  <option value="">Top level</option>
                  {topLevel.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                </select>
                <button type="submit" className="col-span-2 md:col-span-4 btn-luxury btn-luxury-primary justify-center">
                  Ajouter
                </button>
              </form>
            )}

            {loadingItems ? (
              <p className="text-sm text-stone-400">Chargement...</p>
            ) : items.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-stone-400 text-sm">
                Aucun lien. Cliquez sur "Ajouter un lien" pour commencer.
              </div>
            ) : (
              <div>{topLevel.map(item => renderItem(item))}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
