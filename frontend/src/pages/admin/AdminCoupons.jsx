import { useEffect, useState } from 'react';
import { PercentCircle, Plus, Save } from 'lucide-react';
import { createAdminCoupon, getAdminCoupons, updateAdminCoupon } from '../../lib/api';

const emptyCoupon = {
  code: '',
  description: '',
  type: 'percentage',
  value: 0,
  minOrderAmount: 0,
  maxDiscountAmount: '',
  usageLimit: '',
  active: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState(emptyCoupon);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAdminCoupons()
      .then(setCoupons)
      .catch((loadError) => setError(loadError.message || 'Impossible de charger les coupons.'))
      .finally(() => setLoading(false));
  }, []);

  function updateExistingCoupon(id, field, value) {
    setCoupons((current) => current.map((coupon) => (
      coupon.id === id ? { ...coupon, [field]: value } : coupon
    )));
  }

  async function saveCoupon(coupon) {
    setSavingId(coupon.id);
    setError('');
    setMessage('');

    try {
      const saved = await updateAdminCoupon(coupon.id, {
        ...coupon,
        value: Number(coupon.value),
        minOrderAmount: Number(coupon.minOrderAmount),
        maxDiscountAmount: coupon.maxDiscountAmount === '' ? null : Number(coupon.maxDiscountAmount),
        usageLimit: coupon.usageLimit === '' ? null : Number(coupon.usageLimit),
      });
      setCoupons((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setMessage(`Coupon ${saved.code} mis a jour.`);
    } catch (saveError) {
      setError(saveError.message || 'Impossible de mettre a jour ce coupon.');
    } finally {
      setSavingId(null);
    }
  }

  async function createCoupon(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const created = await createAdminCoupon({
        ...newCoupon,
        value: Number(newCoupon.value),
        minOrderAmount: Number(newCoupon.minOrderAmount),
        maxDiscountAmount: newCoupon.maxDiscountAmount === '' ? null : Number(newCoupon.maxDiscountAmount),
        usageLimit: newCoupon.usageLimit === '' ? null : Number(newCoupon.usageLimit),
      });
      setCoupons((current) => [created, ...current]);
      setNewCoupon(emptyCoupon);
      setMessage(`Coupon ${created.code} cree.`);
    } catch (createError) {
      setError(createError.message || 'Impossible de creer ce coupon.');
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={createCoupon} className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex items-center gap-3">
          <PercentCircle className="text-[#043920]" size={20} />
          <h2 className="font-display text-3xl text-somacan-brand">Nouveau coupon</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input value={newCoupon.code} onChange={(event) => setNewCoupon((current) => ({ ...current, code: event.target.value }))} placeholder="Code" className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 outline-none" />
          <input value={newCoupon.description} onChange={(event) => setNewCoupon((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 outline-none" />
          <select value={newCoupon.type} onChange={(event) => setNewCoupon((current) => ({ ...current, type: event.target.value }))} className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 outline-none">
            <option value="percentage">Pourcentage</option>
            <option value="fixed">Montant fixe</option>
            <option value="free_shipping">Livraison offerte</option>
          </select>
          <input value={newCoupon.value} type="number" step="0.01" onChange={(event) => setNewCoupon((current) => ({ ...current, value: event.target.value }))} placeholder="Valeur" className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 outline-none" />
          <input value={newCoupon.minOrderAmount} type="number" step="0.01" onChange={(event) => setNewCoupon((current) => ({ ...current, minOrderAmount: event.target.value }))} placeholder="Minimum commande" className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 outline-none" />
          <input value={newCoupon.usageLimit} type="number" onChange={(event) => setNewCoupon((current) => ({ ...current, usageLimit: event.target.value }))} placeholder="Limite d usage" className="h-12 rounded-xl border border-stone-200 bg-stone-50 px-4 outline-none" />
        </div>
        <button type="submit" className="mt-6 btn-luxury btn-luxury-primary w-fit">
          <Plus size={14} />
          Creer le coupon
        </button>
      </form>

      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <h2 className="font-display text-3xl text-somacan-brand">Coupons existants</h2>
        {loading ? (
          <p className="mt-6 text-stone-500">Chargement...</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="rounded-[1.7rem] bg-stone-50 p-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <input value={coupon.code} onChange={(event) => updateExistingCoupon(coupon.id, 'code', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
                  <input value={coupon.description || ''} onChange={(event) => updateExistingCoupon(coupon.id, 'description', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
                  <select value={coupon.type} onChange={(event) => updateExistingCoupon(coupon.id, 'type', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none">
                    <option value="percentage">Pourcentage</option>
                    <option value="fixed">Montant fixe</option>
                    <option value="free_shipping">Livraison offerte</option>
                  </select>
                  <input value={coupon.value} type="number" step="0.01" onChange={(event) => updateExistingCoupon(coupon.id, 'value', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
                  <input value={coupon.minOrderAmount} type="number" step="0.01" onChange={(event) => updateExistingCoupon(coupon.id, 'minOrderAmount', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
                  <input value={coupon.maxDiscountAmount ?? ''} type="number" step="0.01" onChange={(event) => updateExistingCoupon(coupon.id, 'maxDiscountAmount', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
                  <input value={coupon.usageLimit ?? ''} type="number" onChange={(event) => updateExistingCoupon(coupon.id, 'usageLimit', event.target.value)} className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
                  <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700">
                    <input type="checkbox" checked={coupon.active} onChange={(event) => updateExistingCoupon(coupon.id, 'active', event.target.checked)} />
                    Actif
                  </label>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-stone-500">Utilise {coupon.usageCount} fois</p>
                  <button type="button" onClick={() => saveCoupon(coupon)} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    <Save size={14} />
                    {savingId === coupon.id ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            ))}
            {!coupons.length && <p className="text-sm text-stone-500">Aucun coupon pour le moment.</p>}
          </div>
        )}
      </section>

      {message && <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}
    </div>
  );
}
