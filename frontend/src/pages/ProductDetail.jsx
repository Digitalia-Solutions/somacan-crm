import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Star, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import { useProduct } from '../hooks/useProducts';
import { getPageBySlug } from '../lib/api';
import PageRenderer from '../cms/v2/PageRenderer';

export default function ProductDetail() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { product, loading, error } = useProduct(slug);
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    getPageBySlug('product-detail')
      .then(data => setCmsPage(data))
      .catch(() => {}); // Optional CMS content
  }, []);

  // Inject currentSlug into ProductRelated section content so it filters the current product
  const cmsPageWithSlug = useMemo(() => {
    if (!cmsPage || !slug) return cmsPage;
    return {
      ...cmsPage,
      sections: (cmsPage.sections || []).map(s =>
        s.type === 'ProductRelated'
          ? { ...s, content: { ...s.content, currentSlug: slug } }
          : s
      ),
    };
  }, [cmsPage, slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 pb-20 pt-32">
        <div className="section-padding">
          <div className="mb-12 h-4 w-64 animate-pulse rounded bg-stone-200" />
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-white" />
            <div className="space-y-5">
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
              <div className="h-16 w-4/5 animate-pulse rounded bg-stone-200" />
              <div className="h-10 w-40 animate-pulse rounded bg-stone-200" />
              <div className="h-5 w-full animate-pulse rounded bg-stone-200" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-stone-50 pb-20 pt-32">
        <div className="section-padding">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h1 className="font-serif text-3xl text-somacan-900">Produit introuvable</h1>
            <p className="mt-4 text-stone-500">
              Ce produit n’est pas disponible pour le moment ou n’a pas encore été importé.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex rounded-full bg-somacan-800 px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white"
            >
              Retour à la boutique
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const gallery = product.images?.length ? product.images : [product.mainImage];

  return (
    <main className="pt-28 pb-20 bg-stone-50 min-h-screen md:pt-32">
      <div className="section-padding">
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-6 md:mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="hover:text-somacan-700">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-somacan-700">Boutique</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-somacan-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <ScrollReveal direction="left" className="relative">
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-white">
                <img 
                  src={gallery[activeImage] || gallery[0]} 
                  alt={product.name}
                  className="w-full h-full object-contain bg-[radial-gradient(circle_at_top,rgba(195,223,200,0.38),transparent_32%),linear-gradient(180deg,#fff_0%,#f7fbf8_100%)]"
                />
              </div>
              <div className="flex gap-4">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-somacan-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain bg-white" />
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-gold-400 fill-gold-400' : 'text-stone-300'}`} 
                    />
                  ))}
                  <span className="text-stone-500 text-sm">({product.reviewCount} avis)</span>
                </div>
              )}

              <h1 className="font-serif text-2xl md:text-5xl text-somacan-900 mb-4 md:mb-6">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-6 md:mb-8">
                <span className="text-2xl md:text-3xl font-semibold text-somacan-800">{product.price} MAD</span>
                {product.originalPrice && (
                  <span className="text-xl text-stone-400 line-through">{product.originalPrice} MAD</span>
                )}
              </div>

              <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>

              <div className="flex items-center gap-3 mb-8 md:gap-6 md:mb-10">
                <div className="flex items-center border border-stone-200 rounded-full shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 md:p-4 hover:bg-stone-100 rounded-l-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 md:p-4 hover:bg-stone-100 rounded-r-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart({ ...product, quantity })}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-4 md:px-8 bg-somacan-800 text-white rounded-full font-medium hover:bg-somacan-900 transition-all hover:shadow-xl text-sm md:text-base"
                >
                  <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                  Ajouter au panier
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="text-center p-4 bg-white rounded-2xl">
                  <Truck className="w-6 h-6 text-somacan-600 mx-auto mb-2" />
                  <p className="text-xs text-stone-600">Livraison gratuite</p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl">
                  <Shield className="w-6 h-6 text-somacan-600 mx-auto mb-2" />
                  <p className="text-xs text-stone-600">Paiement sécurisé</p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl">
                  <RotateCcw className="w-6 h-6 text-somacan-600 mx-auto mb-2" />
                  <p className="text-xs text-stone-600">Retour 14 jours</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-somacan-900 mb-3">Ingrédients</h3>
                  <div className="flex flex-wrap gap-2">
                    {(product.ingredients?.length ? product.ingredients : product.tags || []).map((ing, i) => (
                      <span key={i} className="px-3 py-1 bg-somacan-50 text-somacan-700 text-sm rounded-full">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {product.benefits?.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg text-somacan-900 mb-3">Bienfaits</h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-stone-600">
                          <span className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.usage && (
                  <div>
                    <h3 className="font-serif text-lg text-somacan-900 mb-3">Conseils d'utilisation</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{product.usage}</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {cmsPageWithSlug && (
        <div className="mt-20">
          <PageRenderer page={cmsPageWithSlug} />
        </div>
      )}
    </main>
  );
}
