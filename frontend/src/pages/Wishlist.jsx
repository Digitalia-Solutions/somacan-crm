import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] pt-40 pb-24">
        <div className="section-padding max-w-4xl mx-auto text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-stone-200 bg-white">
            <Heart className="w-7 h-7 text-[#043920]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-stone-400 mb-6">Wishlist</p>
          <h1 className="font-display text-5xl md:text-7xl text-somacan-brand leading-[0.92] mb-6">
            Vos envies
            <br />
            <span className="italic font-light text-stone-400">Somacan.</span>
          </h1>
          <p className="text-stone-600 leading-relaxed mb-10">
            Aucun produit enregistre pour le moment.
          </p>
          <Link to="/shop" className="btn-luxury btn-luxury-primary inline-flex">
            Explorer la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] pt-40 pb-24">
      <div className="section-padding max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-stone-400 mb-6">Wishlist</p>
          <h1 className="font-display text-5xl md:text-7xl text-somacan-brand leading-[0.92] mb-6">
            Vos envies
            <br />
            <span className="italic font-light text-stone-400">Somacan.</span>
          </h1>
        </div>

        <div className="grid gap-6">
          {items.map((item) => (
            <div key={item._id} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(28,25,23,0.05)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <img
                  src={item.mainImage || item.image}
                  alt={item.name}
                  className="h-28 w-28 rounded-[1.5rem] bg-stone-50 object-cover"
                />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">
                    {item.category || 'Soin botanique'}
                  </p>
                  <Link to={`/shop/${item.slug || item.id || item._id}`} className="mt-2 block font-display text-3xl leading-tight text-somacan-brand hover:opacity-70">
                    {item.name}
                  </Link>
                  <p className="mt-3 text-lg text-stone-600">{item.price.toFixed(2)} MAD</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="inline-flex items-center gap-2 rounded-full bg-somacan-brand px-5 py-3 text-sm font-semibold text-white"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item._id)}
                    className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
