import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star, Check, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

function toDisplayPrice(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getProductId(product) {
  return product?._id || product?.id || product?.slug;
}

function getProductUrl(product) {
  return `/shop/${product.slug || product.id || product._id}`;
}

function QuickViewModal({
  isOpen,
  onClose,
  product,
  currentImage,
  price,
  oldPrice,
  productUrl,
  productCategory,
  productColors,
  activeColorIndex,
  setActiveColorIndex,
  handleAddToCart,
  handleWishlist,
  isWishlisted,
}) {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative grid w-full max-w-4xl gap-8 rounded-[2rem] bg-[#fcfaf7] p-6 shadow-[0_30px_120px_rgba(28,25,23,0.22)] md:grid-cols-[1.05fr_0.95fr] md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close quick view"
            className="absolute right-5 top-5 rounded-full border border-stone-200 bg-white p-2 text-stone-500 transition-colors hover:text-stone-900"
            onClick={onClose}
          >
            <X size={18} />
          </button>

          <div className="rounded-[1.5rem] bg-white p-6">
            <img
              src={currentImage}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-400">
              {productCategory}
            </p>
            <h3 className="mt-4 font-display text-4xl leading-[0.95] text-somacan-brand">
              {product.name}
            </h3>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl text-somacan-brand">{price.toFixed(2)} MAD</span>
              {oldPrice !== null && oldPrice > 0 && (
                <span className="text-lg text-stone-400 line-through">{oldPrice.toFixed(2)} MAD</span>
              )}
            </div>
            <p className="mt-5 text-sm leading-7 text-stone-600">
              {product.description || 'Decouvrez ce soin botanique et ses details essentiels depuis l aperçu rapide.'}
            </p>

            {productColors && productColors.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {productColors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Select color ${color.name}`}
                    onClick={() => setActiveColorIndex(idx)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                      activeColorIndex === idx ? 'border-somacan-brand scale-110' : 'border-stone-200'
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full" style={{ backgroundColor: color.value }} />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={(e) => {
                  handleAddToCart(e);
                  onClose();
                }}
                className="inline-flex items-center gap-3 rounded-full bg-somacan-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#032b18]"
              >
                <ShoppingCart size={18} />
                Ajouter au panier
              </button>
              <button
                type="button"
                onClick={handleWishlist}
                className="inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300"
              >
                <Heart size={18} fill={isWishlisted ? '#ef4444' : 'none'} stroke={isWishlisted ? '#ef4444' : 'currentColor'} />
                {isWishlisted ? 'Retirer de la wishlist' : 'Ajouter a la wishlist'}
              </button>
              <Link
                to={productUrl}
                onClick={onClose}
                className="inline-flex items-center gap-3 rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300"
              >
                Voir le produit
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/**
 * Modern Premium Product Card Component
 * 
 * @param {Object} props
 * @param {Object} props.product - The product data object
 * @param {Function} props.onAddToCart - Callback for adding to cart
 * @param {Function} props.onWishlistToggle - Callback for toggling wishlist
 * @param {Function} props.onQuickView - Callback for opening quick view
 * @param {string} props.currency - Currency symbol (e.g. '$', 'MAD')
 * @param {boolean} props.isWishlisted - Whether the item is wishlisted externally
 */
export default function ProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  onQuickView,
  currency = '$',
  isWishlisted: externalIsWishlisted = false,
  variant = 'default',
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted: checkIsWishlisted } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(externalIsWishlisted);
  const [cartState, setCartState] = useState('idle'); // 'idle' | 'loading' | 'added'
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const productId = getProductId(product);

  // Sync external wishlist state
  useEffect(() => {
    setIsWishlisted(externalIsWishlisted || checkIsWishlisted(productId));
  }, [checkIsWishlisted, externalIsWishlisted, productId]);

  const activeColor = product.colors && product.colors.length > 0 
    ? product.colors[activeColorIndex] 
    : null;
  
  const currentImage = activeColor?.image || product.image || product.mainImage;
  const price = toDisplayPrice(product.price);
  const oldPrice = product.oldPrice === null || product.oldPrice === undefined || product.oldPrice === ''
    ? null
    : toDisplayPrice(product.oldPrice);
  const isShowcaseVariant = variant === 'showcase';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (cartState !== 'idle') return;
    
    setCartState('loading');
    
    try {
      if (onAddToCart) {
        await onAddToCart(product, activeColor);
      } else {
        addToCart(product);
      }
    
      setCartState('added');
      setTimeout(() => setCartState('idle'), 2000);
    } catch {
      setCartState('idle');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    const nextState = toggleWishlist(product);
    setIsWishlisted(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(product, nextState);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`group relative flex flex-col w-full h-full transition-all duration-500 ease-out ${
        isShowcaseVariant
          ? 'rounded-[2rem] border border-stone-200/70 bg-[#f7f2eb] hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(28,25,23,0.12)]'
          : 'bg-white rounded-3xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 border border-gray-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
    >
      {/* ── IMAGE & BADGES SECTION ── */}
      <div className={`relative aspect-[3/4] xs:aspect-[4/5] overflow-hidden flex items-center justify-center ${isShowcaseVariant ? 'rounded-t-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(245,240,232,1)_70%)] p-4 xs:p-8' : 'rounded-t-3xl bg-gray-50 p-4 xs:p-6'}`}>
        {/* Main Image */}
        <Link to={getProductUrl(product)} className="absolute inset-0 flex items-center justify-center z-10 p-8">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={product.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-full object-contain filter drop-shadow-xl"
            />
          </AnimatePresence>
        </Link>

        {/* Badges (Top Left) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
          {product.discount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm backdrop-blur-md">
              -{product.discount}%
            </span>
          )}
          {product.badge && (
            <span className={`px-3 py-1 text-xs rounded-full shadow-sm backdrop-blur-md ${isShowcaseVariant ? 'bg-white/90 border border-stone-200 text-stone-800 font-bold uppercase tracking-[0.2em]' : 'bg-white/80 text-gray-900 font-semibold border border-gray-200'}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-4 right-4 z-20 flex items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-sm ${isShowcaseVariant ? 'w-10 h-10 border border-stone-200 bg-white/85 text-stone-500 hover:bg-white hover:text-red-500' : 'w-9 h-9 bg-white/80 border border-gray-100 text-gray-400 hover:bg-white hover:text-red-500'}`}
        >
          <motion.div
            animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart size={18} fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "currentColor"} strokeWidth={2} />
          </motion.div>
        </button>

        {/* Quick View Button (Center Hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-4 flex justify-center z-20"
            >
              <button
                onClick={handleQuickView}
                aria-label="Quick view"
                className={`flex items-center gap-2 px-6 py-2.5 backdrop-blur-md text-sm rounded-full shadow-lg transition-colors duration-300 ${isShowcaseVariant ? 'bg-[#043920] text-white font-bold uppercase tracking-[0.2em] hover:bg-[#032b18]' : 'bg-white/90 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white'}`}
              >
                <Eye size={16} />
                Quick View
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PRODUCT DETAILS SECTION ── */}
      <div className={`flex flex-col flex-grow ${isShowcaseVariant ? 'p-4 xs:p-6' : 'p-3 xs:p-5'}`}>
        <div className="flex items-center justify-between mb-1 xs:mb-2">
          <span className={`${isShowcaseVariant ? 'text-[7px] xs:text-[9px] font-bold uppercase tracking-[0.25em] xs:tracking-[0.35em] text-stone-400' : 'text-[10px] xs:text-xs font-semibold uppercase tracking-wider text-gray-400'}`}>
            {product.category}
          </span>
          {/* Rating */}
          {(product.rating || product.reviews) && (
            <div className="flex items-center gap-0.5 xs:gap-1">
              <Star size={10} className="xs:w-3 xs:h-3" fill="#fbbf24" stroke="#fbbf24" />
              <span className="text-[10px] xs:text-xs font-semibold text-gray-600">{product.rating}</span>
            </div>
          )}
        </div>

        <Link to={getProductUrl(product)} className={`block mb-1 transition-colors ${isShowcaseVariant ? 'group-hover:text-somacan-brand' : 'group-hover:text-blue-600'}`}>
          <h3 className={`${isShowcaseVariant ? 'font-display text-lg xs:text-2xl text-somacan-brand leading-[1.05]' : 'font-semibold text-gray-900 text-sm xs:text-lg leading-tight'} line-clamp-2`}>
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-2 xs:pt-4 flex flex-col gap-2 xs:gap-4">
          
          {/* Color Options & Stock */}
          <div className="flex items-center justify-between">
            {product.colors && product.colors.length > 0 ? (
              <div className="flex items-center gap-1 xs:gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    aria-label={`Select color ${color.name}`}
                    onClick={(e) => { e.preventDefault(); setActiveColorIndex(idx); }}
                    className={`w-4 h-4 xs:w-5 xs:h-5 rounded-full border-[1.5px] transition-all flex items-center justify-center ${
                      activeColorIndex === idx ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-110'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 rounded-full shadow-inner" 
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div /> // Spacer
            )}
            
            {product.stock !== undefined && !isShowcaseVariant && (
              <span className={`text-[9px] xs:text-xs font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-emerald-500'}`}>
                {product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `${product.stock} left` : 'In stock'}
              </span>
            )}
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1 xs:gap-2">
                <span className={`${isShowcaseVariant ? 'font-display text-lg xs:text-3xl text-somacan-brand' : 'text-base xs:text-xl font-bold text-gray-900'}`}>
                  {isShowcaseVariant ? `${price.toFixed(0)} MAD` : `${currency}${price.toFixed(2)}`}
                </span>
                {oldPrice !== null && oldPrice > 0 && !isShowcaseVariant && (
                  <span className="text-[10px] xs:text-sm font-medium text-gray-400 line-through">
                    {currency}{oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cartState !== 'idle' || product.stock === 0}
              aria-label="Add to cart"
              className={`relative flex items-center justify-center transition-all duration-300 ${
                cartState === 'added' 
                  ? 'bg-emerald-500 text-white' 
                  : product.stock === 0 
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : isShowcaseVariant
                      ? 'bg-[#043920] text-white hover:bg-[#032b18] hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
              } ${isShowcaseVariant ? 'w-9 h-9 xs:w-12 xs:h-12 rounded-full' : 'w-8 h-8 xs:w-11 xs:h-11 rounded-xl xs:rounded-2xl'}`}
            >
              <AnimatePresence mode="wait">
                {cartState === 'idle' && (
                  <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                    <ShoppingCart size={14} className="xs:hidden" />
                    <ShoppingCart size={18} className="hidden xs:block" />
                  </motion.div>
                )}
                {cartState === 'loading' && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="animate-spin">
                    <Loader2 size={14} className="xs:hidden" />
                    <Loader2 size={18} className="hidden xs:block" />
                  </motion.div>
                )}
                {cartState === 'added' && (
                  <motion.div key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", bounce: 0.5 }}>
                    <Check size={16} strokeWidth={3} className="xs:hidden" />
                    <Check size={20} strokeWidth={3} className="hidden xs:block" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>
      </div>
      </motion.div>
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={product}
        currentImage={currentImage}
        price={price}
        oldPrice={oldPrice}
        productUrl={getProductUrl(product)}
        productCategory={product.category || 'Soin botanique'}
        productColors={product.colors}
        activeColorIndex={activeColorIndex}
        setActiveColorIndex={setActiveColorIndex}
        handleAddToCart={handleAddToCart}
        handleWishlist={handleWishlist}
        isWishlisted={isWishlisted}
      />
    </>
  );
}
