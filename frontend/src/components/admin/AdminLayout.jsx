import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ChevronRight, FileText, FolderTree, KeyRound, LayoutDashboard, Layers, LogOut, Mail, MapPinned, Package, PanelTop, PanelBottom, Palette, PercentCircle, ShoppingBag, Image, Menu } from 'lucide-react';
import { ADMIN_STORAGE_KEY } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const NAV_GROUPS = [
  {
    title: 'Boutique',
    items: [
      { to: '/admin', label: 'Vue générale', icon: LayoutDashboard, match: '/admin' },
      { to: '/admin/orders', label: 'Commandes', icon: ShoppingBag, match: '/admin/orders' },
      { to: '/admin/products', label: 'Produits', icon: Package, match: '/admin/products' },
      { to: '/admin/categories', label: 'Catégories', icon: FolderTree, match: '/admin/categories' },
    ]
  },
  {
    title: 'Contenu CMS',
    items: [
      { to: '/admin/pages', label: 'Page Builder', icon: Layers, match: '/admin/pages' },
      { to: '/admin/content', label: 'Pages & Menus (Legacy)', icon: FileText, match: '/admin/content' },
      { to: '/admin/blogs', label: 'Articles / Journal', icon: FileText, match: '/admin/blogs' },
      { to: '/admin/forms', label: 'Formulaires', icon: FileText, match: '/admin/forms' },
      { to: '/admin/media', label: 'Médiathèque', icon: Image, match: '/admin/media' },
      { to: '/admin/menus', label: 'Menus', icon: Menu, match: '/admin/menus' },
    ]
  },
  {
    title: 'Configuration',
    items: [
      { to: '/admin/shipping', label: 'Livraison', icon: MapPinned, match: '/admin/shipping' },
      { to: '/admin/coupons', label: 'Coupons', icon: PercentCircle, match: '/admin/coupons' },
      { to: '/admin/email', label: 'Email / SMTP', icon: Mail, match: '/admin/email' },
      { to: '/admin/theme', label: 'Thème & Design', icon: Palette, match: '/admin/theme' },
      { to: '/admin/header', label: 'Header / Navbar', icon: PanelTop, match: '/admin/header' },
      { to: '/admin/footer', label: 'Footer', icon: PanelBottom, match: '/admin/footer' },
    ]
  }
];

// Flatten for backward compatibility with existing currentItem logic
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
          <div className="rounded-[2.6rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(28,25,23,0.06)] md:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-white">
              <KeyRound size={22} />
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">Admin access</p>
            <h1 className="mt-3 font-display text-5xl text-somacan-brand">Panneau admin</h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-500">
              Entrez la cle admin du backend pour acceder aux reglages de livraison, aux coupons et aux commandes.
            </p>

            <form onSubmit={saveKey} className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
              <input
                value={inputKey}
                onChange={(event) => setInputKey(event.target.value)}
                placeholder="ADMIN_API_KEY"
                className="h-14 rounded-2xl border border-stone-200 bg-stone-50 px-5 text-sm text-stone-900 outline-none"
              />
              <button type="submit" className="btn-luxury btn-luxury-primary justify-center">
                Ouvrir le panel
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(201,170,115,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(4,57,32,0.06),transparent_28%),#f8f4ee] pb-24 pt-28">
      <div className="section-padding mx-auto max-w-[90vw]">
        <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="relative z-40 xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[2.2rem] bg-stone-900 text-white shadow-[0_24px_80px_rgba(28,25,23,0.16)]">
              <div className="border-b border-white/10 px-6 py-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-500">Back office</p>
                <h2 className="mt-3 font-display text-3xl text-white">Somacan admin</h2>
              </div>

              <div className="px-4 py-4 space-y-6">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <p className="px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500/80">
                      {group.title}
                    </p>
                    <div className="grid gap-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.match;

                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-colors ${
                              isActive 
                                ? 'bg-white text-stone-900 shadow-sm' 
                                : 'text-stone-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <Icon size={16} />
                              <span className="text-sm font-medium">{item.label}</span>
                            </span>
                            {isActive && <ChevronRight size={14} className="text-stone-400" />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 px-4 py-4">
                <button
                  type="button"
                  onClick={clearKey}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={17} />
                  Changer la cle
                </button>
              </div>
            </div>
          </aside>

          <section className="grid gap-6">
            <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm md:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">Administration</p>
              <h1 className="mt-3 font-display text-4xl leading-[0.92] text-somacan-brand md:text-6xl">
                {currentItem.label}
              </h1>
            </div>

            <Outlet />
          </section>
        </div>
      </div>
    </main>
  );
}
