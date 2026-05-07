import { Link, useOutletContext } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../components/account/AccountPanelLayout';

export default function AccountWishlist() {
  const { wishlistItems } = useOutletContext();

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Favoris</p>
          <h2 className="mt-2 font-display text-3xl text-somacan-brand">Ma wishlist</h2>
        </div>
        <Link to="/wishlist" className="text-sm text-stone-500 hover:text-stone-900">
          Ouvrir la page wishlist
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="mt-6 rounded-[1.6rem] bg-stone-50 p-6">
          <Heart className="text-[#043920]" size={20} />
          <p className="mt-4 text-lg text-stone-900">Aucun produit sauvegarde.</p>
          <p className="mt-2 text-sm leading-7 text-stone-500">
            Ajoutez des produits depuis les cartes produits pour les retrouver ici.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {wishlistItems.map((item) => (
            <Link
              key={item._id}
              to={`/shop/${item.slug || item.id || item._id}`}
              className="rounded-[1.6rem] bg-stone-50 p-4 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.3rem] bg-white">
                  <img
                    src={item.mainImage || item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-2xl text-somacan-brand">{item.name}</p>
                  <p className="mt-2 text-sm text-stone-500">{formatCurrency(item.price)}</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-700">
                    Voir le produit
                    <Sparkles size={14} />
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
