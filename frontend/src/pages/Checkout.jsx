import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Percent,
  ShieldCheck,
  Ticket,
  Truck,
  UserPlus,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder, getCheckoutConfig, getCheckoutQuote } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const paymentOptions = [
  {
    id: 'cash_on_delivery',
    label: 'Paiement à la livraison',
    description: 'Le client paie au moment de la réception de la commande.',
  },
  {
    id: 'bank_transfer',
    label: 'Carte bancaire',
    description: 'Nous confirmons la commande après réception du paiement.',
  },
];

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
  paymentMethod: 'cash_on_delivery',
};

function formatCurrency(value) {
  const amount = Number(value);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'} MAD`;
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [checkoutConfig, setCheckoutConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');
  const [checkoutMode, setCheckoutMode] = useState(user ? 'account' : 'guest');
  const [createAccountAfterOrder, setCreateAccountAfterOrder] = useState(true);

  const orderItemsPayload = useMemo(
    () =>
      items.map((item) => ({
        product_id: item._id,
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.mainImage,
      })),
    [items]
  );

  useEffect(() => {
    getCheckoutConfig()
      .then((data) => {
        setCheckoutConfig(data);

        if (!user && data.allowGuestCheckout === false) {
          setCheckoutMode('account');
        }
      })
      .catch(() => {})
      .finally(() => {
        setConfigLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setForm((current) => ({
      ...current,
      firstName: current.firstName || user.firstName || '',
      lastName: current.lastName || user.lastName || '',
      email: current.email || user.email || '',
      phone: current.phone || user.phone || '',
      address: current.address || user.addressLine1 || '',
      city: current.city || user.city || '',
      postalCode: current.postalCode || user.postalCode || '',
    }));
  }, [user]);

  async function refreshQuote(nextCouponCode = appliedCoupon, silentCouponFallback = true) {
    if (!orderItemsPayload.length) return;

    setQuoteLoading(true);

    try {
      const data = await getCheckoutQuote({
        items: orderItemsPayload,
        customer: {
          city: form.city,
        },
        couponCode: nextCouponCode,
      });

      setQuote(data);

      if (nextCouponCode) {
        setAppliedCoupon(nextCouponCode);
      }

      return data;
    } catch (quoteError) {
      if (nextCouponCode && silentCouponFallback) {
        setAppliedCoupon('');
        setCouponError(quoteError.message || 'Ce coupon ne peut pas être appliqué.');
        setCouponMessage('');

        const fallbackData = await getCheckoutQuote({
          items: orderItemsPayload,
          customer: {
            city: form.city,
          },
          couponCode: '',
        });

        setQuote(fallbackData);
        return fallbackData;
      }

      throw quoteError;
    } finally {
      setQuoteLoading(false);
    }
  }

  useEffect(() => {
    if (!orderItemsPayload.length) return;

    refreshQuote(appliedCoupon, true).catch(() => {});
  }, [orderItemsPayload, form.city]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError('Entrez un code coupon.');
      setCouponMessage('');
      return;
    }

    setCouponError('');
    setCouponMessage('');

    try {
      await refreshQuote(code, false);
      setAppliedCoupon(code);
      setCouponMessage(`Coupon ${code} appliqué.`);
    } catch (quoteError) {
      setCouponError(quoteError.message || "Impossible d'appliquer ce coupon.");
    }
  }

  async function handleRemoveCoupon() {
    setCouponInput('');
    setAppliedCoupon('');
    setCouponError('');
    setCouponMessage('');
    await refreshQuote('', false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!items.length) return;

    if (!user && checkoutMode === 'account') {
      setError('Connectez-vous ou repassez en mode invité pour finaliser cette commande.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const latestQuote = await refreshQuote(appliedCoupon, false);

      const createdOrder = await createOrder({
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        items: orderItemsPayload,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        couponCode: appliedCoupon,
        createAccountAfterOrder:
          !user && checkoutMode === 'guest' && createAccountAfterOrder,
        quote: latestQuote,
      });

      setOrder(createdOrder);
      clearCart();
    } catch (submissionError) {
      setError(submissionError.message || 'Impossible de finaliser la commande pour le moment.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!items.length && !order) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] px-6 pb-20 pt-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 text-center shadow-[0_24px_80px_rgba(28,25,23,0.06)]">
          <h1 className="font-display text-4xl text-somacan-brand md:text-5xl">
            Votre panier est vide
          </h1>

          <p className="mt-4 text-stone-500">
            Ajoutez des soins au panier avant de passer au checkout.
          </p>

          <Link to="/shop" className="btn-luxury btn-luxury-primary mx-auto mt-8 w-fit">
            Retour à la boutique
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  if (order) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] px-6 pb-20 pt-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-[0_28px_90px_rgba(28,25,23,0.07)] md:p-14">
          <CheckCircle2 className="text-gold-500" size={36} />

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.36em] text-stone-400">
            Commande confirmée
          </p>

          <h1 className="mt-3 font-display text-4xl leading-tight text-somacan-brand md:text-6xl">
            Merci. Votre commande a bien été enregistrée.
          </h1>

          <p className="mt-6 max-w-2xl text-[16px] font-light leading-8 text-stone-600">
            Référence #{order.id}. Le calcul de la livraison et des remises a été validé côté serveur.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <SuccessStat label="Statut" value="En attente" />
            <SuccessStat
              label="Paiement"
              value={order.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : 'Paiement à la livraison'}
            />
            <SuccessStat label="Livraison" value={formatCurrency(order.shippingCost)} />
            <SuccessStat label="Montant" value={formatCurrency(order.totalAmount)} />
          </div>

          {!user && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {order.guestPortalUrl && (
                <a
                  href={order.guestPortalUrl}
                  className="rounded-[1.7rem] border border-stone-200 bg-stone-50 p-5 text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-stone-400">
                    Suivi invité
                  </p>
                  <p className="mt-3 text-base">Consulter cette commande sans compte</p>
                </a>
              )}

              {order.accountClaimUrl && (
                <a
                  href={order.accountClaimUrl}
                  className="rounded-[1.7rem] border border-gold-300 bg-gold-50 p-5 text-stone-700 transition-colors hover:border-gold-500"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-gold-700">
                    Compte client
                  </p>
                  <p className="mt-3 text-base">Créer votre compte à partir de cette commande</p>
                </a>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop" className="btn-luxury btn-luxury-primary">
              Continuer vos achats
              <ArrowRight size={14} />
            </Link>

            <Link to="/" className="btn-luxury btn-luxury-outline">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] pb-20 pt-28 md:pt-32">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="mb-7 md:mb-10">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft size={13} />
            Retour au panier
          </Link>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
            Checkout
          </p>

          <h1 className="mt-2 font-display leading-[0.95] text-somacan-brand" style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}>
            Finaliser
            <br />
            <span className="font-light italic text-stone-400">
              votre commande.
            </span>
          </h1>
        </div>

        <div className="grid gap-5 md:gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <form id="checkout-form" onSubmit={handleSubmit} className="order-2 space-y-6 lg:order-1">
            {!user && (
              <CheckoutCard title="Mode de commande">
                <div className="grid gap-4">
                  <ChoiceBox
                    checked={checkoutMode === 'guest'}
                    onChange={() => setCheckoutMode('guest')}
                    title="Commander sans compte"
                    description="Le client peut commander en invité puis recevoir un email de suivi et de création de compte."
                    name="checkoutMode"
                  />

                  <ChoiceBox
                    checked={checkoutMode === 'account'}
                    onChange={() => setCheckoutMode('account')}
                    title="Commander avec un compte"
                    name="checkoutMode"
                    muted={checkoutConfig?.allowGuestCheckout === false}
                    description={
                      <>
                        Le compte client garde l'historique et les informations pour les prochaines commandes.{' '}
                        <Link to="/login" className="font-medium text-somacan-brand">
                          Se connecter
                        </Link>
                      </>
                    }
                  />
                </div>

                {checkoutMode === 'guest' && checkoutConfig?.guestAccountInviteEnabled && (
                  <label className="mt-5 flex items-start gap-3 rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                    <input
                      type="checkbox"
                      checked={createAccountAfterOrder}
                      onChange={(event) => setCreateAccountAfterOrder(event.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm leading-7 text-stone-600">
                      Envoyer un email après la commande pour créer un compte et retrouver facilement l'historique.
                    </span>
                  </label>
                )}
              </CheckoutCard>
            )}

            <CheckoutCard title="Informations client">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['firstName', 'Prénom'],
                  ['lastName', 'Nom'],
                  ['email', 'Email'],
                  ['phone', 'Téléphone'],
                  ['city', 'Ville'],
                  ['postalCode', 'Code postal'],
                ].map(([name, label]) => (
                  <Field
                    key={name}
                    name={name}
                    label={label}
                    value={form[name]}
                    onChange={updateField}
                    required={name !== 'postalCode'}
                  />
                ))}

                <Field
                  name="address"
                  label="Adresse"
                  value={form.address}
                  onChange={updateField}
                  required
                  className="md:col-span-2"
                />

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
                    Note de commande
                  </span>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={updateField}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
                  />
                </label>
              </div>
            </CheckoutCard>

            <CheckoutCard
              title={
                <span className="flex items-center gap-3">
                  <Ticket className="text-gold-500" size={20} />
                  Coupon et remises
                </span>
              }
            >
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <input
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  placeholder="Entrer un code coupon"
                  className="h-14 rounded-2xl border border-stone-200 bg-stone-50 px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
                />

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-full bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-stone-700"
                >
                  Appliquer
                </button>
              </div>

              {appliedCoupon && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[1.3rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <Percent size={16} />
                  <span>Coupon actif : {appliedCoupon}</span>
                  <button type="button" onClick={handleRemoveCoupon} className="font-medium underline">
                    Retirer
                  </button>
                </div>
              )}

              {couponMessage && <p className="mt-4 text-sm text-emerald-700">{couponMessage}</p>}
              {couponError && <p className="mt-4 text-sm text-red-600">{couponError}</p>}
            </CheckoutCard>

            <CheckoutCard title="Paiement">
              <div className="space-y-4">
                {paymentOptions.map((option) => (
                  <ChoiceBox
                    key={option.id}
                    checked={form.paymentMethod === option.id}
                    onChange={updateField}
                    name="paymentMethod"
                    value={option.id}
                    title={option.label}
                    description={option.description}
                  />
                ))}
              </div>
            </CheckoutCard>

            {error && (
              <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>

          <aside className="order-1 h-fit rounded-[1.5rem] md:rounded-[2rem] bg-stone-900 p-4 md:p-6 text-stone-100 shadow-[0_24px_80px_rgba(28,25,23,0.15)] lg:order-2 lg:sticky lg:top-28">
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-500">
              Récapitulatif
            </p>

            <h2 className="mt-2 font-display text-2xl md:text-4xl text-white">
              Votre commande
            </h2>

            <div className="mt-5 max-h-[220px] md:max-h-[330px] space-y-2 md:space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-3"
                >
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      Quantité {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm text-stone-200">
                    {(item.price * item.quantity).toFixed(2)} MAD
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-4 border-t border-white/10 pt-6 text-sm">
              <SummaryLine label="Sous-total" value={formatCurrency(quote?.subtotalAmount ?? totalPrice)} />
              <SummaryLine
                label="Livraison"
                value={quoteLoading ? 'Calcul...' : formatCurrency(quote?.shippingCost ?? 0)}
              />
              <SummaryLine
                label="Réduction"
                value={quoteLoading ? '...' : `-${formatCurrency(quote?.discountAmount ?? 0)}`}
              />

              <div className="flex items-center justify-between border-t border-white/10 pt-5">
                <span className="font-display text-2xl text-white">Total</span>
                <span className="font-display text-3xl text-gold-500">
                  {formatCurrency(quote?.totalAmount ?? totalPrice)}
                </span>
              </div>
            </div>

            <div className="mt-7 grid gap-3">
              <DarkInfo
                icon={<ShieldCheck size={18} />}
                text="Calculs de livraison et coupon validés côté serveur."
              />

              <DarkInfo
                icon={<Truck size={18} />}
                text="Livraison gérée selon les règles configurées côté admin."
              />

              {!user && (
                <DarkInfo
                  icon={<UserPlus size={18} />}
                  text="Commande possible sans compte avec lien de suivi par email."
                />
              )}
            </div>

            {configLoading && (
              <p className="mt-5 text-sm text-stone-400">
                Chargement des règles de checkout...
              </p>
            )}

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting || quoteLoading}
              className="mt-7 w-full rounded-full bg-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-all hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Validation...' : 'Confirmer la commande'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CheckoutCard({ title, children }) {
  return (
    <section className="rounded-[1.5rem] md:rounded-[2rem] bg-white p-5 shadow-[0_12px_40px_rgba(28,25,23,0.05)] md:p-8">
      <h2 className="font-display text-2xl md:text-3xl text-somacan-brand">{title}</h2>
      <div className="mt-5 md:mt-7">{children}</div>
    </section>
  );
}

function ChoiceBox({ checked, onChange, name, value, title, description, muted = false }) {
  return (
    <label
      className={`flex cursor-pointer gap-4 rounded-[1.5rem] border p-5 transition-all ${
        checked
          ? 'border-[#043920] bg-[#043920]/[0.03]'
          : 'border-stone-200 bg-stone-50 hover:border-stone-300'
      } ${muted ? 'opacity-60' : ''}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1"
      />

      <div>
        <p className="text-sm font-semibold text-stone-900">{title}</p>
        <p className="mt-2 text-sm font-light leading-7 text-stone-500">
          {description}
        </p>
      </div>
    </label>
  );
}

function Field({ name, label, value, onChange, required, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
        {label}
      </span>

      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
      />
    </label>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function DarkInfo({ icon, text }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0 text-gold-500">{icon}</div>
        <p className="text-sm font-light leading-6 text-stone-300">{text}</p>
      </div>
    </div>
  );
}

function SuccessStat({ label, value }) {
  return (
    <div className="rounded-[1.5rem] bg-stone-50 p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
        {label}
      </p>
      <p className="mt-3 text-base text-stone-900">{value}</p>
    </div>
  );
}