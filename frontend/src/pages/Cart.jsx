import { Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 bg-stone-50 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-6" />

          <h1 className="font-serif text-3xl text-somacan-900 mb-4">
            Votre panier est vide
          </h1>

          <p className="text-stone-500 mb-8">
            Découvrez nos produits et commencez votre routine CBD.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-somacan-800 text-white rounded-full font-medium hover:bg-somacan-900 transition-all"
          >
            Continuer les achats
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] pb-20 pt-32">
      <div className="section-padding mx-auto max-w-[100rem]">
        <ScrollReveal>
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">
                Panier
              </p>

              <h1 className="font-display text-4xl leading-[0.95] text-somacan-brand md:text-6xl lg:text-7xl">
                Votre sélection
                <br />
                <span className="font-light italic text-stone-400">
                  de soins.
                </span>
              </h1>
            </div>

            <div className="w-fit rounded-full border border-stone-200 bg-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <ScrollReveal>
            <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_18px_60px_rgba(28,25,23,0.05)]">
              <div className="hidden border-b border-stone-100 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400 md:grid md:grid-cols-[1.6fr_0.7fr_0.8fr_0.7fr_auto] md:gap-4">
                <span>Produit</span>
                <span>Prix</span>
                <span>Quantité</span>
                <span className="text-right">Total</span>
                <span />
              </div>

              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="grid gap-4 p-4 transition-colors hover:bg-stone-50/70 md:grid-cols-[1.6fr_0.7fr_0.8fr_0.7fr_auto] md:items-center md:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-2xl bg-stone-50 object-cover"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-[9px] font-bold uppercase tracking-[0.22em] text-stone-400">
                          {item.category || 'Soin botanique'}
                        </p>

                        <Link
                          to={`/shop/${item.slug}`}
                          className="mt-1 block truncate font-display text-xl text-somacan-brand transition-opacity hover:opacity-70"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:block">
                      <span className="text-xs text-stone-400 md:hidden">
                        Prix
                      </span>
                      <span className="text-sm text-stone-600">
                        {item.price} MAD
                      </span>
                    </div>

                    <div className="flex items-center justify-between md:block">
                      <span className="text-xs text-stone-400 md:hidden">
                        Quantité
                      </span>

                      <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, Math.max(1, item.quantity - 1))
                          }
                          className="rounded-l-full p-2 transition-colors hover:bg-stone-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="rounded-r-full p-2 transition-colors hover:bg-stone-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:block md:text-right">
                      <span className="text-xs text-stone-400 md:hidden">
                        Total
                      </span>

                      <span className="font-display text-xl text-somacan-brand">
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="justify-self-end rounded-full p-3 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Supprimer le produit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <aside className="rounded-[2.25rem] bg-stone-900 p-5 text-stone-100 shadow-[0_24px_80px_rgba(28,25,23,0.16)] md:p-7 lg:sticky lg:top-28">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-500">
                Récapitulatif
              </p>

              <h2 className="mt-3 font-display text-4xl text-white">
                Commande
              </h2>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Sous-total</span>
                  <span>{totalPrice.toFixed(2)} MAD</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">Livraison</span>
                  <span>Gratuite</span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="font-display text-2xl text-white">
                    Total
                  </span>
                  <span className="font-display text-3xl text-gold-500">
                    {totalPrice.toFixed(2)} MAD
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <InfoItem
                  icon={<Truck size={18} />}
                  text="Livraison gratuite avec confirmation manuelle avant expédition."
                />

                <InfoItem
                  icon={<ShieldCheck size={18} />}
                  text="Checkout protégé avec collecte simple des informations client."
                />

                <InfoItem
                  icon={<CreditCard size={18} />}
                  text="Paiement à la livraison ou virement bancaire disponibles."
                />
              </div>

              <Link
                to="/checkout"
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-all hover:bg-stone-100"
              >
                Passer au checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/shop"
                className="mt-4 block text-center text-sm text-stone-400 transition-colors hover:text-white"
              >
                Continuer les achats
              </Link>
            </aside>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}

function InfoItem({ icon, text }) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0 text-gold-500">{icon}</div>
        <p className="text-sm font-light leading-6 text-stone-300">{text}</p>
      </div>
    </div>
  );
}