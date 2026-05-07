import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Headphones,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldCheck,
  User2,
} from 'lucide-react';
import { getMyOrders } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const navItems = [
  { to: '/account', label: 'Vue generale', icon: LayoutDashboard, match: '/account' },
  { to: '/account/orders', label: 'Mes commandes', icon: Package, match: '/account/orders' },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart, match: '/account/wishlist' },
  { to: '/account/profile', label: 'Mon profil', icon: User2, match: '/account/profile' },
  { to: '/account/security', label: 'Securite', icon: ShieldCheck, match: '/account/security' },
  { to: '/account/support', label: 'Support', icon: Headphones, match: '/account/support' },
];

export function formatDate(value) {
  if (!value) return 'Non disponible';

  return new Date(value).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(value) {
  const amount = Number(value);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'} MAD`;
}

export function getInitials(user) {
  return `${user?.firstName?.[0] || 'S'}${user?.lastName?.[0] || ''}`.toUpperCase();
}

export function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[1.7rem] border border-stone-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">{label}</p>
      <p className="mt-4 font-display text-4xl text-somacan-brand">{value}</p>
      <p className="mt-2 text-sm text-stone-500">{detail}</p>
    </div>
  );
}

export default function AccountPanelLayout() {
  const { user, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    let active = true;

    getMyOrders()
      .then((data) => {
        if (active) {
          setOrders(Array.isArray(data) ? data : []);
          setOrderError('');
        }
      })
      .catch(() => {
        if (active) {
          setOrderError('Impossible de recuperer votre historique de commandes pour le moment.');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingOrders(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;
    const completedOrders = orders.filter((order) => order.status === 'completed').length;
    const latestOrder = orders[0] || null;
    const lastShipping = latestOrder?.customer
      ? `${latestOrder.customer.address}, ${latestOrder.customer.city}`
      : 'Ajoutez une commande pour enregistrer votre premiere adresse.';

    return {
      totalOrders,
      totalSpent,
      pendingOrders,
      completedOrders,
      latestOrder,
      lastShipping,
      wishlistCount: wishlistItems.length,
      memberSince: formatDate(user?.createdAt),
    };
  }, [orders, wishlistItems.length, user?.createdAt]);

  const currentItem = navItems.find((item) => location.pathname === item.match) || navItems[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(201,170,115,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(4,57,32,0.07),transparent_28%),#f8f4ee] pb-24 pt-28">
      <div className="section-padding mx-auto max-w-[95vw]">
        <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[2.2rem] bg-stone-900 text-white shadow-[0_24px_80px_rgba(28,25,23,0.16)]">
              <div className="border-b border-white/10 px-6 py-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(201,170,115,0.35),rgba(4,57,32,0.96))] font-display text-2xl">
                    {getInitials(user)}
                  </div>
                  <div>
                    <p className="font-display text-2xl">{user?.firstName}</p>
                    <p className="mt-1 text-sm text-stone-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="grid gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.match;

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                          isActive ? 'bg-white text-stone-900' : 'text-stone-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={17} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </span>
                        <ChevronRight size={16} />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 px-4 py-4">
                <div className="grid gap-2">
                  <Link
                    to="/"
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Home size={17} />
                    Retour a l accueil
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <LogOut size={17} />
                    Deconnexion
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="grid gap-6">
            <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm md:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">Dashboard client</p>
                  <h1 className="mt-3 font-display text-4xl leading-[0.92] text-somacan-brand md:text-6xl">
                    {currentItem.label}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500">
                    Un vrai espace client avec navigation laterale et pages dediees pour chaque partie du compte.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/shop" className="btn-luxury btn-luxury-primary">
                    Explorer la boutique
                  </Link>
                  <Link
                    to="/account/orders"
                    className="btn-luxury border border-stone-200 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900"
                  >
                    Voir mes commandes
                  </Link>
                </div>
              </div>
            </div>

            <Outlet
              context={{
                user,
                orders,
                loadingOrders,
                orderError,
                wishlistItems,
                stats,
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
