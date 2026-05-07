import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Clock3, Package } from 'lucide-react';
import { getGuestOrder } from '../lib/api';

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

export default function GuestOrderAccess() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !token) {
      setError('Lien de suivi invalide.');
      setLoading(false);
      return;
    }

    getGuestOrder(id, token)
      .then(setOrder)
      .catch((loadError) => {
        setError(loadError.message || 'Impossible de charger cette commande.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  return (
    <main className="min-h-screen bg-[#fcfaf7] pb-20 pt-32">
      <div className="section-padding mx-auto max-w-5xl">
        <div className="rounded-[2.4rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(28,25,23,0.06)] md:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">Suivi invite</p>
          <h1 className="mt-4 font-display text-5xl text-somacan-brand md:text-6xl">Votre commande</h1>

          {loading && <p className="mt-8 text-stone-500">Chargement de la commande...</p>}
          {!loading && error && <p className="mt-8 text-red-600">{error}</p>}

          {!loading && order && (
            <div className="mt-8 grid gap-8">
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-[1.5rem] bg-stone-50 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Reference</p>
                  <p className="mt-3 text-lg text-stone-900">#{order.id}</p>
                </div>
                <div className="rounded-[1.5rem] bg-stone-50 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Statut</p>
                  <p className="mt-3 text-lg text-stone-900">{order.status}</p>
                </div>
                <div className="rounded-[1.5rem] bg-stone-50 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Total</p>
                  <p className="mt-3 text-lg text-stone-900">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>

              <div className="rounded-[1.8rem] bg-stone-900 p-6 text-white">
                <div className="flex items-center gap-3 text-stone-300">
                  <Clock3 size={16} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="mt-5 space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${index}`} className="flex items-center justify-between rounded-[1.2rem] bg-white/5 px-4 py-3">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {order.accountClaimUrl && (
                  <a href={order.accountClaimUrl} className="btn-luxury btn-luxury-primary">
                    Creer mon compte
                  </a>
                )}
                <Link to="/shop" className="btn-luxury btn-luxury-outline">
                  Revenir a la boutique
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
