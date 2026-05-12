import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ProductCard from '../components/ui/ProductCard';
import { getCategories } from '../lib/api';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';

const SORT_OPTIONS = [
  { id: 'featured',   label: 'Sélection Somacan' },
  { id: 'newest',     label: 'Dernières Créations' },
  { id: 'price-low',  label: 'Prix Croissant' },
  { id: 'price-high', label: 'Prix Décroissant' },
];

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-stone-100 rounded-[2rem] mb-6" />
      <div className="h-2 w-1/4 bg-stone-100 rounded-full mb-4" />
      <div className="h-6 w-3/4 bg-stone-100 rounded-lg mb-4" />
      <div className="h-6 w-1/3 bg-stone-100 rounded-lg" />
    </div>
  );
}

const shopHeroImg = resolveCmsAssetUrl('/asset/background Univers catégories.png');

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';
  
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sortBy, setSortBy]                 = useState('featured');
  const [maxPrice, setMaxPrice]             = useState(2000);
  const { addToCart } = useCart();
  const headerRef = useRef(null);

  // Sync category state with URL
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    getCategories()
      .then(data => setCategories([{ id: 'all', name: 'Tous les Soins' }, ...data]))
      .catch(console.error);
  }, []);

  const query = useMemo(() => {
    const q = {};
    if (activeCategory !== 'all') {
      q.categoryId = activeCategory;
    }
    return q;
  }, [activeCategory]);

  const { products, loading } = useProducts(query);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
    tl.from('.shop-hero-bg', { scale: 1.1, opacity: 0, duration: 2 })
      .from('.shop-header-item', { y: 40, opacity: 0, stagger: 0.1 }, "-=1.5");
  }, { scope: headerRef });

  const filtered = useMemo(() => {
    let r = [...products].filter(p => p.price <= maxPrice);
    if (sortBy === 'price-low')  r.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') r.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest')     r.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'featured')   r.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
    return r;
  }, [products, sortBy, maxPrice]);

  const ceiling = useMemo(
    () => products.length ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 2000,
    [products]
  );

  const isFiltered = activeCategory !== 'all' || sortBy !== 'featured' || maxPrice < ceiling;

  function reset() {
    setSearchParams({});
    setActiveCategory('all');
    setSortBy('featured');
    setMaxPrice(ceiling);
  }

  function handleCategoryClick(id) {
    if (id === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: id });
    }
    setActiveCategory(id);
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7]">
      {/* Immersive Hero Header */}
      <div ref={headerRef} className="relative h-[45vh] xs:h-[55vh] md:h-[70vh] flex items-center overflow-hidden">
        {/* Background Image with Parallax-like scale */}
        <div className="absolute inset-0 z-0">
          <img 
            src={shopHeroImg} 
            alt="Boutique Hero" 
            className="shop-hero-bg w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fcfaf7] via-[#fcfaf7]/60 to-transparent" />
        </div>

        <div className="section-padding max-w-[90rem] mx-auto relative z-10 w-full">
          <div className="max-w-3xl">
            <p className="shop-header-item text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-stone-500 mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
              <span className="w-8 md:w-12 h-px bg-stone-300" />
              L'Art du Soin
            </p>
            <h1 className="shop-header-item font-display text-4xl xs:text-5xl sm:text-7xl md:text-9xl text-[#043920] leading-[0.85] mb-6 md:mb-8">
              Boutique<br />
              <span className="italic font-light text-stone-400">Holistique.</span>
            </h1>
            <p className="shop-header-item text-xs md:text-sm text-stone-600 font-light max-w-xs md:max-w-md leading-relaxed">
              Explorez une collection de soins botaniques d'exception, où chaque flacon renferme l'âme des rituels marocains et la pureté du CBD.
            </p>
          </div>
        </div>
      </div>


      {/* Filter Experience */}
      <div className="sticky top-[60px] md:top-[64px] z-40 px-2 xs:px-4 md:px-6 lg:px-8 -mt-8 md:-mt-12">
        <div className="max-w-[90rem] mx-auto rounded-[1.5rem] md:rounded-[2rem] border border-[#e6ddd0] bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(90,74,49,0.1)] overflow-hidden">
          <div className="px-4 py-4 md:px-10 md:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-8">
            
              {/* Category selection - Scrollable on mobile */}
              <div className="flex overflow-x-auto gap-2 md:gap-3 no-scrollbar pb-1 md:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] md:tracking-[0.28em] transition-all duration-500 ${
                      activeCategory == cat.id
                        ? 'bg-[#043920] text-[#fcfaf7] shadow-lg'
                        : 'bg-white/50 text-stone-500 border border-stone-100 hover:border-[#043920]/20 hover:bg-white'
                    }`}
                  >
                    {cat.name || cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-4 md:gap-8">
                {/* Price filter - simpler for mobile */}
                <div className="hidden sm:flex items-center gap-4">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">Budget</span>
                    <input
                      type="range"
                      min={0}
                      max={ceiling}
                      step={50}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-20 md:w-32 accent-[#043920] cursor-pointer"
                    />
                    <span className="text-[10px] font-display text-[#043920]">{maxPrice} MAD</span>
                </div>

                {/* Sort selector */}
                <div className="relative group flex-1 xs:flex-none">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-stone-50 md:bg-white/70 border border-stone-100 rounded-xl md:rounded-2xl pl-4 pr-10 py-2 md:py-3 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600 focus:outline-none focus:border-[#043920]/30 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
                </div>

                {/* Status */}
                <div className="flex items-center gap-3 md:gap-6 pl-3 md:pl-4 border-l border-stone-100">
                  <span className="text-[8px] md:text-[9px] text-stone-400 uppercase tracking-[0.2em] font-medium">
                    {loading ? '...' : `${filtered.length}`}
                  </span>
                  {isFiltered && (
                    <button onClick={reset} className="text-stone-300 hover:text-[#043920] transition-colors">
                      <RotateCcw size={14} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="section-padding max-w-[90rem] mx-auto py-12 md:py-24">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-10 md:gap-y-20">
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 md:py-40">
            <h2 className="font-display text-3xl md:text-4xl text-[#043920] mb-4 md:mb-6 italic opacity-20">L'écho du silence...</h2>
            <p className="text-stone-400 font-light mb-8 md:mb-10 text-sm">Aucun soin ne correspond à votre sélection actuelle.</p>
            <button onClick={reset} className="btn-luxury btn-luxury-outline mx-auto">
              Réinitialiser
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + sortBy + maxPrice}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-10 md:gap-y-20"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.05, 0.2) }}
                >
                  <ProductCard product={product} className="w-full" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
