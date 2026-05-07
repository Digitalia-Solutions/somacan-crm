import { Link, useOutletContext } from 'react-router-dom';
import { ChevronRight, Clock3, Package } from 'lucide-react';
import { StatCard, formatCurrency, formatDate, getInitials } from '../../components/account/AccountPanelLayout';

export default function AccountOverview() {
  const { user, orders, loadingOrders, orderError, stats } = useOutletContext();
  const recentOrders = orders.slice(0, 4);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Commandes" value={stats.totalOrders} detail="Toutes vos commandes enregistrees." />
        <StatCard label="Montant total" value={formatCurrency(stats.totalSpent)} detail="Total depense sur votre compte." />
        <StatCard label="En attente" value={stats.pendingOrders} detail="Commandes en cours de traitement." />
        <StatCard label="Wishlist" value={stats.wishlistCount} detail="Produits sauvegardes pour plus tard." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Commande recente</p>
              <h2 className="mt-2 font-display text-3xl text-somacan-brand">Activite recente</h2>
            </div>
            <Link to="/account/orders" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900">
              Voir tout
              <ChevronRight size={16} />
            </Link>
          </div>

          {loadingOrders && (
            <div className="mt-6 rounded-[1.5rem] bg-stone-50 p-5 text-stone-500">
              Chargement des commandes...
            </div>
          )}

          {!loadingOrders && orderError && (
            <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-red-700">
              {orderError}
            </div>
          )}

          {!loadingOrders && !orderError && recentOrders.length === 0 && (
            <div className="mt-6 rounded-[1.5rem] bg-stone-50 p-6">
              <Package className="text-gold-500" size={20} />
              <p className="mt-4 text-lg text-stone-900">Aucune commande pour le moment.</p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                Passez votre premiere commande pour voir son suivi ici.
              </p>
            </div>
          )}

          {!loadingOrders && !orderError && recentOrders.length > 0 && (
            <div className="mt-6 space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="rounded-[1.5rem] bg-stone-50 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Commande #{order.id}</p>
                      <p className="mt-3 font-display text-2xl text-somacan-brand">{formatCurrency(order.totalAmount)}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
                        <Clock3 size={14} />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-stone-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                        {order.status}
                      </span>
                      <span className="rounded-full bg-gold-500/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-700">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Compte</p>
          <h2 className="mt-2 font-display text-3xl text-somacan-brand">Resume client</h2>

          <div className="mt-6 rounded-[1.6rem] bg-stone-900 p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(201,170,115,0.35),rgba(4,57,32,0.96))] font-display text-2xl">
                {getInitials(user)}
              </div>
              <div>
                <p className="font-display text-2xl">{user?.firstName} {user?.lastName}</p>
                <p className="mt-1 text-sm text-stone-300">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="rounded-[1.4rem] bg-stone-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Membre depuis</p>
              <p className="mt-2 text-sm text-stone-700">{stats.memberSince}</p>
            </div>
            <div className="rounded-[1.4rem] bg-stone-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Adresse recente</p>
              <p className="mt-2 text-sm leading-7 text-stone-700">{stats.lastShipping}</p>
            </div>
            <div className="rounded-[1.4rem] bg-stone-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Telephone</p>
              <p className="mt-2 text-sm text-stone-700">{user?.phone || 'Non renseigne'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
