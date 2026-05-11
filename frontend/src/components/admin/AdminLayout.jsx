import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronRight, FileText, FolderTree, KeyRound, LayoutDashboard, Layers, 
  LogOut, Mail, MapPinned, Package, PanelTop, PanelBottom, Palette, 
  PercentCircle, ShoppingBag, Image, Menu, Home, Settings
} from 'lucide-react';
import { ADMIN_STORAGE_KEY } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const NAV_GROUPS = [
  {
    title: 'E-commerce',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, match: '/admin' },
      { to: '/admin/orders', label: 'Commandes', icon: ShoppingBag, match: '/admin/orders' },
      { to: '/admin/products', label: 'Produits', icon: Package, match: '/admin/products' },
      { to: '/admin/categories', label: 'Catégories', icon: FolderTree, match: '/admin/categories' },
    ]
  },
  {
    title: 'CMS & Contenu',
    items: [
      { to: '/admin/pages', label: 'Page Builder', icon: Layers, match: '/admin/pages' },
      { to: '/admin/blogs', label: 'Journal / Blog', icon: FileText, match: '/admin/blogs' },
      { to: '/admin/media', label: 'Médiathèque', icon: Image, match: '/admin/media' },
      { to: '/admin/menus', label: 'Menus', icon: Menu, match: '/admin/menus' },
      { to: '/admin/forms', label: 'Soumissions', icon: Mail, match: '/admin/forms' },
    ]
  },
  {
    title: 'Système',
    items: [
      { to: '/admin/shipping', label: 'Livraison', icon: MapPinned, match: '/admin/shipping' },
      { to: '/admin/coupons', label: 'Coupons', icon: PercentCircle, match: '/admin/coupons' },
      { to: '/admin/theme', label: 'Thème & Design', icon: Palette, match: '/admin/theme' },
      { to: '/admin/header', label: 'Configuration Navbar', icon: PanelTop, match: '/admin/header' },
      { to: '/admin/footer', label: 'Configuration Footer', icon: PanelBottom, match: '/admin/footer' },
      { to: '/admin/email', label: 'Paramètres Email', icon: Settings, match: '/admin/email' },
    ]
  }
];

const navItems = NAV_GROUPS.flatMap(g => g.items);

export default function AdminLayout() {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();
  const [inputKey, setInputKey] = useState(() => window.localStorage.getItem(ADMIN_STORAGE_KEY) || '');
  const [hasKey, setHasKey] = useState(() => Boolean(window.localStorage.getItem(ADMIN_STORAGE_KEY)));

  const currentItem = useMemo(
    () => navItems.find((item) => item.match === location.pathname) || navItems[0],
    [location.pathname]
  );

  function saveKey(event) {
    event.preventDefault();
    window.localStorage.setItem(ADMIN_STORAGE_KEY, inputKey.trim());
    setHasKey(Boolean(inputKey.trim()));
  }

  function clearKey() {
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    setHasKey(false);
    if (isAdmin) {
      logout();
    }
  }

  if (!hasKey && !isAdmin) {
    return (
      <main className="min-h-screen bg-[#f8f4ee] pb-24 pt-28">
        <div className="section-padding mx-auto max-w-4xl">
          <div className="rounded-[2.6rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(28,25,23,0.06)] md:p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-stone-900 text-white shadow-xl">
              <KeyRound size={28} />
            </div>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.4em] text-stone-400">Authentification</p>
            <h1 className="mt-4 font-display text-6xl text-somacan-brand">Espace Admin</h1>
            <p className="mt-6 mx-auto max-w-md text-sm leading-7 text-stone-500">
              Veuillez saisir votre clé d'accès pour administrer la boutique Somacan.
            </p>

            <form onSubmit={saveKey} className="mt-10 max-w-md mx-auto flex flex-col gap-4">
              <input
                type="password"
                value={inputKey}
                onChange={(event) => setInputKey(event.target.value)}
                placeholder="ADMIN_API_KEY"
                className="h-16 rounded-2xl border border-stone-200 bg-stone-50 px-6 text-center text-lg font-mono tracking-widest text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
              />
              <Button type="submit" variant="primary" size="lg" className="h-16">
                Déverrouiller l'accès
              </Button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#f8f4ee]">
    <div className="flex h-[100dvh] overflow-hidden">
      {/* Sidebar */}
      <aside className="shrink-0 w-72 border-r border-stone-200 bg-stone-950 text-stone-400 flex flex-col overflow-y-auto">
          <div className="shrink-0 p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-stone-950 font-display text-2xl font-bold shadow-lg">S</div>
              <div>
                <h2 className="font-display text-2xl text-white leading-none">Somacan</h2>
                <p className="text-[9px] uppercase tracking-[0.3em] text-stone-500 mt-1 font-bold">Backoffice V2</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 overflow-y-auto scrollbar-hide">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="mb-10">
                <div className="px-5 mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500/60 flex items-center gap-3">
                  {group.title}
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid gap-1.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.match;

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-3.5 rounded-2xl px-5 py-3.5 transition-all duration-300 group ${
                          isActive 
                            ? 'bg-white text-stone-950 shadow-[0_15px_40px_rgba(255,255,255,0.08)]' 
                            : 'hover:text-white hover:bg-white/5 text-stone-500'
                        }`}
                      >
                        <Icon size={18} className={`${isActive ? 'text-stone-950' : 'group-hover:text-white'} transition-colors`} />
                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="active-pill"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" 
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="shrink-0 p-6 border-t border-white/5">
            <button
              type="button"
              onClick={clearKey}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-stone-500 hover:text-white hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </aside>

      {/* Main area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="shrink-0 z-40 h-20 bg-white/80 backdrop-blur-md border-b border-stone-200 px-10 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-stone-400">
                <Home size={16} />
                <ChevronRight size={14} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium">Administration</span>
                <ChevronRight size={14} className="text-stone-400" />
                <span className="text-stone-900 font-bold">{currentItem.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="/" 
                target="_blank" 
                className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Voir le site
                <ChevronRight size={14} />
              </a>
              <div className="h-8 w-px bg-stone-200" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-stone-900 leading-none">Administrateur</p>
                  <p className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-tighter">Accès total</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400">
                  <Settings size={20} />
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto p-10">
            <Outlet />
          </div>
      </main>
    </div>
    </div>
  );
}
