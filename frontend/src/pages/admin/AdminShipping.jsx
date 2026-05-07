import { useEffect, useState } from 'react';
import { MapPinned, Plus, Save, Trash2 } from 'lucide-react';
import { getAdminShippingSettings, updateAdminShippingSettings } from '../../lib/api';

const initialForm = {
  baseShippingCost: 30,
  freeShippingThreshold: 400,
  allowGuestCheckout: true,
  guestAccountInviteEnabled: true,
  currency: 'MAD',
  cityRates: [],
};

export default function AdminShipping() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminShippingSettings()
      .then((data) => {
        setForm({
          baseShippingCost: Number(data.baseShippingCost ?? 30),
          freeShippingThreshold: Number(data.freeShippingThreshold ?? 400),
          allowGuestCheckout: Boolean(data.allowGuestCheckout),
          guestAccountInviteEnabled: Boolean(data.guestAccountInviteEnabled),
          currency: data.currency || 'MAD',
          cityRates: Array.isArray(data.cityRates) ? data.cityRates : [],
        });
      })
      .catch((loadError) => {
        setError(loadError.message || 'Impossible de charger les regles de livraison.');
      })
      .finally(() => setLoading(false));
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function updateCityRate(index, field, value) {
    setForm((current) => ({
      ...current,
      cityRates: current.cityRates.map((entry, entryIndex) => (
        entryIndex === index ? { ...entry, [field]: value } : entry
      )),
    }));
  }

  function addCityRate() {
    setForm((current) => ({
      ...current,
      cityRates: [...current.cityRates, { city: '', cost: 0 }],
    }));
  }

  function removeCityRate(index) {
    setForm((current) => ({
      ...current,
      cityRates: current.cityRates.filter((_, entryIndex) => entryIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...form,
        baseShippingCost: Number(form.baseShippingCost),
        freeShippingThreshold: Number(form.freeShippingThreshold),
        cityRates: form.cityRates.map((entry) => ({
          city: entry.city,
          cost: Number(entry.cost),
        })),
      };
      const data = await updateAdminShippingSettings(payload);
      setForm({
        baseShippingCost: Number(data.baseShippingCost),
        freeShippingThreshold: Number(data.freeShippingThreshold),
        allowGuestCheckout: Boolean(data.allowGuestCheckout),
        guestAccountInviteEnabled: Boolean(data.guestAccountInviteEnabled),
        currency: data.currency,
        cityRates: Array.isArray(data.cityRates) ? data.cityRates : [],
      });
      setMessage('Regles de livraison mises a jour.');
    } catch (saveError) {
      setError(saveError.message || 'Impossible d enregistrer les regles.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex items-center gap-3">
          <MapPinned className="text-[#043920]" size={20} />
          <h2 className="font-display text-3xl text-somacan-brand">Regles globales</h2>
        </div>

        {loading ? (
          <p className="mt-6 text-stone-500">Chargement...</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Frais de base</span>
              <input name="baseShippingCost" type="number" step="0.01" value={form.baseShippingCost} onChange={updateField} className="h-14 rounded-2xl border border-stone-200 bg-stone-50 px-5 outline-none" />
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Seuil livraison gratuite</span>
              <input name="freeShippingThreshold" type="number" step="0.01" value={form.freeShippingThreshold} onChange={updateField} className="h-14 rounded-2xl border border-stone-200 bg-stone-50 px-5 outline-none" />
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Devise</span>
              <input name="currency" value={form.currency} onChange={updateField} className="h-14 rounded-2xl border border-stone-200 bg-stone-50 px-5 outline-none" />
            </label>
            <div className="grid gap-4">
              <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-700">
                <input type="checkbox" name="allowGuestCheckout" checked={form.allowGuestCheckout} onChange={updateField} />
                Autoriser les commandes invitees
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-700">
                <input type="checkbox" name="guestAccountInviteEnabled" checked={form.guestAccountInviteEnabled} onChange={updateField} />
                Envoyer l invitation de creation de compte
              </label>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-somacan-brand">Tarifs par ville</h2>
          <button type="button" onClick={addCityRate} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            <Plus size={14} />
            Ajouter
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          {form.cityRates.map((entry, index) => (
            <div key={`${entry.city}-${index}`} className="grid gap-4 rounded-[1.6rem] bg-stone-50 p-4 md:grid-cols-[1fr_180px_auto]">
              <input value={entry.city} onChange={(event) => updateCityRate(index, 'city', event.target.value)} placeholder="Ville" className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
              <input value={entry.cost} type="number" step="0.01" onChange={(event) => updateCityRate(index, 'cost', event.target.value)} placeholder="Tarif" className="h-12 rounded-xl border border-stone-200 bg-white px-4 outline-none" />
              <button type="button" onClick={() => removeCityRate(index)} className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-4 text-stone-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {!form.cityRates.length && <p className="text-sm text-stone-500">Aucun tarif specifique defini.</p>}
        </div>
      </section>

      {message && <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}

      <button type="submit" disabled={saving} className="btn-luxury btn-luxury-primary w-fit">
        <Save size={14} />
        {saving ? 'Enregistrement...' : 'Enregistrer les regles'}
      </button>
    </form>
  );
}
