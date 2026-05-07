import { useEffect, useMemo, useState } from 'react';
import { Clock3, Save } from 'lucide-react';
import { getAdminOrders, updateAdminOrder } from '../../lib/api';

function formatCurrency(value) {
  const amount = Number(value);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'} MAD`;
}

function formatDate(value) {
  if (!value) return 'Non disponible';

  return new Date(value).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminOrders()
      .then(setOrders)
      .catch((loadError) => setError(loadError.message || 'Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === 'guest') return orders.filter((order) => !order.userId);
    if (filter === 'converted') return orders.filter((order) => Boolean(order.guestConvertedAt));
    return orders;
  }, [orders, filter]);

  function updateLocalOrder(id, field, value) {
    setOrders((current) => current.map((order) => (
      order.id === id ? { ...order, [field]: value } : order
    )));
  }

  async function saveOrder(order) {
    setSavingId(order.id);
    setError('');
    setMessage('');

    try {
      const saved = await updateAdminOrder(order.id, {
        status: order.status,
        paymentStatus: order.paymentStatus,
        notes: order.notes,
      });
      setOrders((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setMessage(`Commande #${saved.id} mise a jour.`);
    } catch (saveError) {
      setError(saveError.message || 'Impossible de mettre a jour cette commande.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-3xl text-somacan-brand">Commandes clients</h2>
          <p className="mt-2 text-sm text-stone-500">Suivi des commandes invitees et des commandes rattachees a un compte.</p>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none">
          <option value="all">Toutes</option>
          <option value="guest">Invites seulement</option>
          <option value="converted">Invites converties</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-stone-500">Chargement...</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="rounded-[1.7rem] bg-stone-50 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Commande #{order.id}</p>
                  <p className="mt-3 font-display text-2xl text-somacan-brand">{formatCurrency(order.totalAmount)}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
                    <Clock3 size={14} />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <select value={order.status} onChange={(event) => updateLocalOrder(order.id, 'status', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none">
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <select value={order.paymentStatus} onChange={(event) => updateLocalOrder(order.id, 'paymentStatus', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none">
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_280px]">
                <div className="grid gap-3">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${index}`} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 rounded-[1.4rem] bg-white p-4 text-sm text-stone-600">
                  <p><strong>Client:</strong> {order.customer?.firstName} {order.customer?.lastName}</p>
                  <p><strong>Email:</strong> {order.customer?.email}</p>
                  <p><strong>Mode:</strong> {order.userId ? 'Compte' : 'Invite'}</p>
                  <p><strong>Conversion:</strong> {order.guestConvertedAt ? 'Oui' : 'Non'}</p>
                  <textarea value={order.notes || ''} onChange={(event) => updateLocalOrder(order.id, 'notes', event.target.value)} rows={4} className="mt-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none" placeholder="Notes admin ou commande" />
                  <button type="button" onClick={() => saveOrder(order)} className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    <Save size={14} />
                    {savingId === order.id ? 'Sauvegarde...' : 'Mettre a jour'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!filteredOrders.length && <p className="text-sm text-stone-500">Aucune commande pour ce filtre.</p>}
        </div>
      )}

      {message && <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{message}</div>}
      {error && <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}
    </section>
  );
}
