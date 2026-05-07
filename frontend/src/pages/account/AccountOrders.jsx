import { Link, useOutletContext } from 'react-router-dom';
import { Clock3, Package } from 'lucide-react';
import { StatCard, formatCurrency, formatDate } from '../../components/account/AccountPanelLayout';

export default function AccountOrders() {
  const { orders, loadingOrders, orderError, stats } = useOutletContext();

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Historique</p>
          <h2 className="mt-2 font-display text-3xl text-somacan-brand">Mes commandes</h2>
        </div>
        <Link to="/shop" className="text-sm text-stone-500 hover:text-stone-900">
          Continuer mes achats
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Total" value={stats.totalOrders} detail="Toutes vos commandes." />
        <StatCard label="En attente" value={stats.pendingOrders} detail="En traitement actuellement." />
        <StatCard label="Terminees" value={stats.completedOrders} detail="Commandes finalisees." />
      </div>

      <div className="mt-6 space-y-4">
        {loadingOrders && (
          <div className="rounded-[1.5rem] bg-stone-50 p-5 text-stone-500">
            Chargement des commandes...
          </div>
        )}

        {!loadingOrders && orderError && (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-red-700">
            {orderError}
          </div>
        )}

        {!loadingOrders && !orderError && orders.length === 0 && (
          <div className="rounded-[1.5rem] bg-stone-50 p-6">
            <Package className="text-gold-500" size={20} />
            <p className="mt-4 text-lg text-stone-900">Aucune commande enregistree.</p>
            <p className="mt-2 text-sm leading-7 text-stone-500">Votre historique apparaitra ici automatiquement.</p>
          </div>
        )}

        {!loadingOrders && !orderError && orders.map((order) => (
          <div key={order.id} className="rounded-[1.6rem] bg-stone-50 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
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

            <div className="mt-5 grid gap-3">
              {order.items.map((item, index) => (
                <div key={`${order.id}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
