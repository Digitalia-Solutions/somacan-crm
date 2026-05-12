import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Package, FileText, TrendingUp, Users,
  CreditCard, Mail, Bell, Clock, CheckCircle, XCircle,
  AlertCircle, ArrowRight, Loader2,
} from 'lucide-react';
import {
  getAdminOrders,
  getAdminProducts,
  getAdminContactSubmissions,
  getAdminNewsletterSubscribers,
} from '../../lib/api';

function fmt(n) {
  return Number(n || 0).toLocaleString('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtMoney(n) {
  return `${fmt(n)} MAD`;
}

function formatDate(v) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusBadge(status) {
  const map = {
    pending:    { label: 'En attente',  cls: 'bg-amber-50 text-amber-700 border-amber-100' },
    processing: { label: 'En cours',    cls: 'bg-blue-50 text-blue-700 border-blue-100' },
    shipped:    { label: 'Expédiée',    cls: 'bg-violet-50 text-violet-700 border-violet-100' },
    delivered:  { label: 'Livrée',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    cancelled:  { label: 'Annulée',     cls: 'bg-red-50 text-red-700 border-red-100' },
  };
  const s = map[status] || { label: status, cls: 'bg-stone-100 text-stone-500 border-stone-200' };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${s.cls}`}>
      {s.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, loading }) {
  return (
    <div className="rounded-[1.75rem] border border-stone-200/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
        <div className={`rounded-xl bg-stone-50 p-2 ${color}`}>
          <Icon size={15} />
        </div>
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded-lg bg-stone-100" />
      ) : (
        <p className="mt-3 font-display text-2xl text-somacan-brand">{value}</p>
      )}
      {sub && !loading && (
        <p className="mt-1 text-[11px] text-stone-400">{sub}</p>
      )}
    </div>
  );
}

const NAV_CARDS = [
  { to: '/admin/orders',   title: 'Commandes',      text: 'Statuts, suivi et gestion.',             icon: ShoppingBag },
  { to: '/admin/products', title: 'Produits',        text: 'Catalogue, stocks et variantes.',        icon: Package },
  { to: '/admin/content',  title: 'Site Web',        text: 'CMS, pages, menus et blocs.',            icon: FileText },
  { to: '/admin/forms',    title: 'Formulaires',     text: 'Messages, newsletter et popup.',         icon: Mail },
  { to: '/admin/email',    title: 'Email / SMTP',    text: 'Configuration des notifications.',       icon: Bell },
  { to: '/admin/blogs',    title: 'Journal',         text: 'Articles et inspirations.',              icon: FileText },
];

export default function AdminOverview() {
  const [orders, setOrders]           = useState([]);
  const [products, setProducts]       = useState([]);
  const [contacts, setContacts]       = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getAdminOrders(),
      getAdminProducts(),
      getAdminContactSubmissions(),
      getAdminNewsletterSubscribers(),
    ]).then(([o, p, c, s]) => {
      if (o.status === 'fulfilled') setOrders(Array.isArray(o.value) ? o.value : []);
      if (p.status === 'fulfilled') setProducts(Array.isArray(p.value) ? p.value : []);
      if (c.status === 'fulfilled') setContacts(Array.isArray(c.value) ? c.value : []);
      if (s.status === 'fulfilled') setSubscribers(Array.isArray(s.value) ? s.value : []);
      setLoading(false);
    });
  }, []);

  // ── Computed stats ──────────────────────────────────────
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const ordersThisMonth  = orders.filter(o => new Date(o.createdAt) >= monthStart);
  const revenueThisMonth = ordersThisMonth
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const avgCart = ordersThisMonth.length
    ? revenueThisMonth / ordersThisMonth.filter(o => o.status !== 'cancelled').length
    : 0;

  const pendingOrders  = orders.filter(o => o.status === 'pending').length;
  const newContacts    = contacts.filter(c => c.status === 'new').length;
  const activeSubCount = subscribers.filter(s => s.status === 'active').length;
  const lowStockCount  = products.filter(p => Number(p.stock ?? 0) <= 3).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="space-y-4 md:space-y-8">

      {/* ── KPI Stats ── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="CA du mois"        value={fmtMoney(revenueThisMonth)} sub={`Total: ${fmtMoney(totalRevenue)}`}  icon={TrendingUp}  color="text-emerald-600" loading={loading} />
        <StatCard label="Commandes / mois"  value={ordersThisMonth.length}      sub={`${pendingOrders} en attente`}       icon={ShoppingBag} color="text-amber-600"   loading={loading} />
        <StatCard label="Panier moyen"      value={fmtMoney(avgCart)}           sub={`${orders.length} commandes total`}  icon={CreditCard}  color="text-violet-600"  loading={loading} />
        <StatCard label="Abonnés newsletter" value={activeSubCount}             sub={`${subscribers.length} inscrits`}    icon={Users}       color="text-blue-600"    loading={loading} />
      </div>

      {/* ── Alerts row ── */}
      {!loading && (pendingOrders > 0 || newContacts > 0 || lowStockCount > 0) && (
        <div className="flex flex-wrap gap-2 md:gap-3">
          {pendingOrders > 0 && (
            <Link to="/admin/orders" className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors">
              <AlertCircle size={13} />
              <span className="truncate max-w-[150px] sm:max-w-none">{pendingOrders} commande{pendingOrders > 1 ? 's' : ''} en attente</span>
              <ArrowRight size={12} />
            </Link>
          )}
          {newContacts > 0 && (
            <Link to="/admin/forms" className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors">
              <Mail size={13} />
              <span className="truncate max-w-[150px] sm:max-w-none">{newContacts} message{newContacts > 1 ? 's' : ''}</span>
              <ArrowRight size={12} />
            </Link>
          )}
          {lowStockCount > 0 && (
            <Link to="/admin/products" className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold text-red-700 hover:bg-red-100 transition-colors">
              <XCircle size={13} />
              <span className="truncate max-w-[150px] sm:max-w-none">{lowStockCount} stock bas</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      )}

      {/* ── Main grid: recent orders + contacts ── */}
      <div className="grid gap-4 md:gap-6 xl:grid-cols-[1fr_360px]">

        {/* Recent orders */}
        <div className="rounded-[1.5rem] md:rounded-[2rem] border border-stone-200/70 bg-white p-4 md:p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h2 className="font-display text-xl md:text-2xl text-somacan-brand">Commandes</h2>
            <Link to="/admin/orders" className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 hover:text-stone-700 flex items-center gap-1">
              Tout voir <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-2xl bg-stone-100" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-stone-400">Aucune commande.</p>
          ) : (
            <div className="divide-y divide-stone-50 overflow-x-auto">
              {recentOrders.map((order) => {
                const customer = order.customer || {};
                const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email || 'Client';
                return (
                  <div key={order.id} className="flex items-center justify-between gap-4 py-3.5 min-w-[300px]">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-800">{name}</p>
                      <p className="text-[10px] text-stone-400">{formatDate(order.createdAt)} · #{order.id}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <div className="hidden xs:block">
                        {statusBadge(order.status)}
                      </div>
                      <span className="text-sm font-bold text-somacan-brand whitespace-nowrap">
                        {fmtMoney(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4 md:space-y-6">

          {/* Recent messages */}
          <div className="rounded-[1.5rem] md:rounded-[2rem] border border-stone-200/70 bg-white p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg md:text-xl text-somacan-brand">Messages</h2>
              <Link to="/admin/forms" className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 hover:text-stone-700 flex items-center gap-1">
                Tout <ArrowRight size={11} />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-stone-100" />)}
              </div>
            ) : recentContacts.length === 0 ? (
              <p className="text-sm text-stone-400">Aucun message.</p>
            ) : (
              <div className="space-y-2">
                {recentContacts.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-xl bg-stone-50 px-3 py-2.5">
                    <div className={`h-2 w-2 flex-shrink-0 rounded-full ${c.status === 'new' ? 'bg-blue-500' : 'bg-stone-300'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800">{c.firstName} {c.lastName}</p>
                      <p className="truncate text-[10px] text-stone-400">{c.subject || c.email}</p>
                    </div>
                    <p className="flex-shrink-0 text-[9px] md:text-[10px] text-stone-400">{formatDate(c.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products summary */}
          <div className="rounded-[1.5rem] md:rounded-[2rem] border border-stone-200/70 bg-white p-4 md:p-6 shadow-sm">
            <h2 className="font-display text-lg md:text-xl text-somacan-brand mb-4">Catalogue</h2>
            {loading ? (
              <div className="h-16 animate-pulse rounded-xl bg-stone-100" />
            ) : (
              <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
                <div className="rounded-xl bg-stone-50 py-3">
                  <p className="font-display text-xl md:text-2xl text-somacan-brand">{products.length}</p>
                  <p className="text-[9px] md:text-[10px] text-stone-400 mt-1 uppercase font-bold">Total</p>
                </div>
                <div className="rounded-xl bg-emerald-50 py-3">
                  <p className="font-display text-xl md:text-2xl text-emerald-700">{products.filter(p => p.active !== false).length}</p>
                  <p className="text-[9px] md:text-[10px] text-emerald-500 mt-1 uppercase font-bold">Actifs</p>
                </div>
                <div className="rounded-xl bg-red-50 py-3">
                  <p className="font-display text-xl md:text-2xl text-red-600">{lowStockCount}</p>
                  <p className="text-[9px] md:text-[10px] text-red-400 mt-1 uppercase font-bold">Stock</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Nav cards ── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 pb-8 md:pb-0">
        {NAV_CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group flex items-start gap-4 rounded-[1.5rem] md:rounded-[1.75rem] border border-stone-200/70 bg-white p-4 md:p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-stone-50 text-somacan-brand transition-colors group-hover:bg-somacan-brand group-hover:text-white">
              <card.icon size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm md:text-base text-stone-800">{card.title}</p>
              <p className="mt-0.5 text-[11px] md:text-xs leading-relaxed text-stone-400">{card.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
