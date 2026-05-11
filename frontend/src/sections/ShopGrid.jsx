import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { getCategories } from '../lib/api';
import ProductCard from '../components/ui/ProductCard';

/**
 * Usage:
 *   <ShopGrid />
 *   <ShopGrid initialCategory="cbd-oil" />
 */

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

export default function ShopGrid({ initialCategory = 'all' }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || initialCategory
  );
  const [sortBy, setSortBy]   = useState('featured');
  const [maxPrice, setMaxPrice] = useState(2000);

  // eslint-disable-next-line no-unused-vars
  const { addToCart } = useCart();

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

  const ceiling = useMemo(
    () => products.length ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 2000,
    [products]
  );

  const filtered = useMemo(() => {
    let r = [...products].filter(p => p.price <= maxPrice);
    if (sortBy === 'price-low')  r.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') r.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest')     r.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'featured')   r.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));
    return r;
  }, [products, sortBy, maxPrice]);

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
    <>
      {/* Filter Experience */}
      <div className="sticky top-[64px] z-40 px-3 md:px-6 lg:px-8 pt-3 md:pt-4">
        <div className="max-w-[90rem] mx-auto rounded-[1.5rem] md:rounded-[2rem] border border-[#e6ddd0] bg-gradient-to-r from-[#fcfaf7]/96 via-[#fcfaf7]/94 to-[#f3ede3]/92 backdrop-blur-2xl shadow-[0_22px_60px_rgba(90,74,49,0.08)] overflow-hidden relative">
          <div className="px-4 py-4 md:section-padding md:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">

              {/* Category selection — horizontal scroll on mobile */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 md:pb-0 md:flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`shrink-0 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.28em] transition-all duration-500 ${
                      activeCategory == cat.id
                        ? 'bg-[#043920] text-[#fcfaf7] shadow-[0_16px_30px_rgba(4,57,32,0.18)]'
                        : 'bg-white/72 text-stone-500 border border-white/70 hover:border-[#043920]/20 hover:bg-white hover:text-[#043920]'
                    }`}
                  >
                    {cat.name || cat.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                {/* Price filter */}
                <div className="flex items-center gap-6 group">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-bold uppercase tracking-[0.35em] text-stone-400">Budget Max</span>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={ceiling}
                        step={50}
                        value={maxPrice}
                        onChange={e => setMaxPrice(Number(e.target.value))}
                        className="w-32 accent-[#043920] cursor-pointer"
                      />
                      <span className="text-xs font-display text-[#043920] w-16">{maxPrice} MAD</span>
                    </div>
                  </div>
                </div>

                {/* Sort selector */}
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none bg-white/72 border border-white/70 rounded-2xl pl-5 pr-12 py-3 text-[9px] font-bold uppercase tracking-[0.24em] text-stone-600 focus:outline-none focus:border-[#043920]/30 cursor-pointer transition-all hover:bg-white"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none group-hover:text-[#043920] transition-colors" />
                </div>

                {/* Status + reset */}
                <div className="flex items-center gap-6 pl-4 border-l border-[#ded5c7]">
                  <span className="text-[9px] text-stone-400 uppercase tracking-[0.3em] font-medium">
                    {loading ? '...' : `${filtered.length} Soins`}
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-20">
            {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 md:py-40">
            <h2 className="font-display text-3xl md:text-4xl text-[#043920] mb-6 italic opacity-20">L'écho du silence...</h2>
            <p className="text-stone-400 font-light mb-10">Aucun soin ne correspond à votre sélection actuelle.</p>
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
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-20"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <ProductCard product={product} className="w-full" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}
