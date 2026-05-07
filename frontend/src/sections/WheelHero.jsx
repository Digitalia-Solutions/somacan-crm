import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Eye, ShoppingCart, Minus, Plus, ArrowLeft, ArrowRight, ChevronRight, LogIn, UserPlus, User2, LogOut, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';

const logoDark = new URL('../public/asset/cropped-LOGO_SOMACAN_SHOP__1_-removebg-preview.webp', import.meta.url).href;
const heroNavItems = [
  { label: 'Accueil', to: '/' },
  { label: 'Boutique', to: '/shop' },
  { label: 'Notre Histoire', to: '/about' },
  { label: 'Journal', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

// Product data for the hero slider
const HERO_PRODUCTS = [
  {
    id: 'sleep-30',
    slug: 'sleep-30-dissolvable-wafers',
    name: "Sleep 30 Dissolvable Wafers",
    dosage: "250 mg",
    description: "Designed to support a restful night's sleep without the grogginess of traditional sleep aids. Dissolves in seconds.",
    price: 450,
    image: new URL('../public/asset/Huile_relaxante_Produit_-removebg-preview.png', import.meta.url).href,
    bgGradient: "linear-gradient(135deg, #0d1f14, #050e09)",
    accentColor: "#0d1f14",
    options: [30, 60, 90]
  },
  {
    id: 'relax-cbd',
    slug: 'relax-cbd-oral-spray',
    name: "Relax CBD Oral Spray",
    dosage: "500 mg",
    description: "A fast-acting oral spray infused with premium CBD and botanical extracts to help you find your calm instantly.",
    price: 520,
    image: new URL('../public/asset/Soin-intensif-corps-ARGAN-Produit-2-removebg-preview.png', import.meta.url).href,
    bgGradient: "linear-gradient(135deg, #1c1917, #0a0908)",
    accentColor: "#1c1917",
    options: [15, 30, 45]
  },
  {
    id: 'vitality-boost',
    slug: 'vitality-boost-tincture',
    name: "Vitality Boost Tincture",
    dosage: "1000 mg",
    description: "Recharge your day with our high-potency CBD tincture, blended with energizing terpenes and MCT oil.",
    price: 680,
    image: new URL('../public/asset/WhatsApp_Image_2026-05-04_at_14.29.51-removebg-preview.png', import.meta.url).href,
    bgGradient: "linear-gradient(135deg, #B87D22, #4A320E)",
    accentColor: "#B87D22",
    options: [30, 60, 120]
  }
];

export default function WheelHero({ products: cmsProducts }) {
  const currentProducts = cmsProducts && cmsProducts.length > 0 ? cmsProducts : HERO_PRODUCTS;
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(30);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { addToCart, totalItems } = useCart();
  const { logout, user } = useAuth();
  const isAuthenticated = !!user;
  const containerRef = useRef(null);
  const wheelRef = useRef(null);
  
  const activeProduct = currentProducts[index];

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % currentProducts.length);
    setQuantity(1);
  }, [currentProducts.length]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + currentProducts.length) % currentProducts.length);
    setQuantity(1);
  }, [currentProducts.length]);

  // Animation for the wheel rotation
  useEffect(() => {
    if (!wheelRef.current) return;
    const products = wheelRef.current.children;
    const total = currentProducts.length;
    const angleStep = 360 / total;
    
    gsap.to(wheelRef.current, {
      rotationY: -index * angleStep,
      duration: 1.5,
      ease: "power4.inOut"
    });

    Array.from(products).forEach((child, i) => {
        const isActive = i === index;
        gsap.to(child, {
            opacity: isActive ? 1 : 0.2,
            scale: isActive ? 1 : 0.8,
            filter: isActive ? 'blur(0px)' : 'blur(8px)',
            duration: 1,
            ease: "power3.out"
        });
    });
  }, [index, currentProducts.length]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden transition-colors duration-1000"
      style={{ background: activeProduct.bgGradient || activeProduct.accentColor || '#0d1f14' }}

    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-black/20 blur-[100px] rounded-full" />
        
        {/* Animated Petals/Shapes */}
        <motion.div 
          animate={{ rotate: 360, x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[15%] w-64 h-64 opacity-[0.03] text-white fill-current"
        >
          <svg viewBox="0 0 200 200"><path d="M100,0 C150,50 150,150 100,200 C50,150 50,50 100,0 Z" /></svg>
        </motion.div>
        
        <motion.div 
          animate={{ rotate: -360, x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] left-[5%] w-96 h-96 opacity-[0.02] text-white fill-current"
        >
          <svg viewBox="0 0 200 200"><path d="M100,0 C150,50 150,150 100,200 C50,150 50,50 100,0 Z" /></svg>
        </motion.div>
      </div>

      {/* Full-screen Inner Container Card */}
      <div className="absolute inset-6 md:inset-10 lg:inset-12 bg-white/[0.03] backdrop-blur-[80px] rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col z-10">
        
        {/* ── Top Header Navigation ── */}
        <header className="flex items-center justify-between px-10 py-6 md:px-16">
          <Link to="/" className="flex items-center group">
            <img src={logoDark} alt="Somacan" className="h-10 md:h-12 w-auto transition-all duration-700 group-hover:scale-105" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            {heroNavItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.to}
                className="relative text-[11px] font-bold tracking-[0.3em] uppercase transition-colors group text-white/70 hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full bg-white/40" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/account" className="hidden rounded-full p-2 transition-colors hover:bg-white/10 md:flex" aria-label="Mon compte">
                  <User2 className="w-5 h-5 text-white/80" />
                </Link>
                <button type="button" onClick={logout} className="hidden rounded-full p-2 transition-colors hover:bg-white/10 md:flex" aria-label="Deconnexion">
                  <LogOut className="w-5 h-5 text-white/80" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden rounded-full p-2 transition-colors hover:bg-white/10 md:flex" aria-label="Connexion">
                  <LogIn className="w-5 h-5 text-white/80" />
                </Link>
                <Link to="/register" className="hidden rounded-full p-2 transition-colors hover:bg-white/10 md:flex" aria-label="Inscription">
                  <UserPlus className="w-5 h-5 text-white/80" />
                </Link>
              </>
            )}
            <Link to="/wishlist" className="rounded-full p-2 transition-colors hover:bg-white/10" aria-label="Wishlist">
              <Heart className="w-5 h-5 text-white/80" />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2 transition-colors hover:bg-white/10" aria-label="Panier">
              <ShoppingBag className="w-5 h-5 text-white/80" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2 transition-colors hover:bg-white/10 md:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white/80" />
              )}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div className="absolute inset-x-6 top-24 z-40 rounded-[2rem] border border-stone-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.12)] backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-8">
              {heroNavItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-4xl text-[#043920] border-b border-stone-100 pb-4"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                      <User2 className="w-5 h-5 text-[#043920]" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="rounded-full border border-stone-200 p-3"
                    >
                      <LogOut className="w-5 h-5 text-[#043920]" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                      <LogIn className="w-5 h-5 text-[#043920]" />
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                      <UserPlus className="w-5 h-5 text-[#043920]" />
                    </Link>
                  </>
                )}
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                  <Heart className="w-5 h-5 text-[#043920]" />
                </Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                  <ShoppingBag className="w-5 h-5 text-[#043920]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Content Body ── */}
        <div className="flex-1 relative grid grid-cols-12 items-center px-10 md:px-16 lg:px-24 pb-12">
          
          {/* Left: Product Info */}
          <div className="col-span-12 lg:col-span-4 z-20 flex flex-col items-start order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to="/shop" className="flex items-center gap-3 text-white/40 mb-10 group hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white transition-all">
                    <ArrowLeft size={12} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Collection Boutique</span>
                </Link>
                
                <h1 className="font-display text-5xl md:text-7xl xl:text-8xl text-white leading-[0.85] mb-8">
                  {activeProduct.name.split(' ').map((word, i) => (
                    <span 
                      key={i} 
                      className={`block ${i % 2 === 1 ? 'italic font-light opacity-60 ml-4 md:ml-8' : ''}`}
                      style={{ 
                        color: activeProduct.nameColor || undefined,
                        fontSize: activeProduct.nameSize && activeProduct.nameSize.includes('px') ? activeProduct.nameSize : undefined
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </h1>
                
                <div className="flex items-center gap-4 mb-10">
                  <span className="px-6 py-2.5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 backdrop-blur-md">
                    {activeProduct.dosage}
                  </span>
                  <div className="w-12 h-[1px] bg-white/10" />
                  <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest italic">Formule Botanique</span>
                </div>

                <p className="text-white/40 text-sm font-light leading-relaxed max-w-[340px]">
                  {activeProduct.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center: 3D Wheel Slider */}
          <div className="col-span-12 lg:col-span-4 h-full flex items-center justify-center relative perspective-[1200px] z-10 order-1 lg:order-2">
            <div 
              ref={wheelRef}
              className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {currentProducts.map((prod, i) => {
                const rotation = (i * 360) / currentProducts.length;
                return (
                  <div 
                    key={prod.id || i}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ 
                      transform: `rotateY(${rotation}deg) translateZ(400px)`,
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <img 
                      src={resolveCmsAssetUrl(prod.image)} 
                      alt={prod.name}
                      className="w-[280px] md:w-[450px] xl:w-[580px] drop-shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                      style={{ 
                        animation: i === index ? 'float 6s ease-in-out infinite' : 'none'
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Slider Navigation Arrows */}
            <div className="absolute bottom-4 flex items-center gap-10 z-50">
               <button 
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/30 hover:text-white hover:border-white transition-all bg-white/[0.03] backdrop-blur-md hover:scale-110 active:scale-95"
               >
                  <ArrowLeft size={18} strokeWidth={1} />
               </button>
               <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/30 hover:text-white hover:border-white transition-all bg-white/[0.03] backdrop-blur-md hover:scale-110 active:scale-95"
               >
                  <ArrowRight size={18} strokeWidth={1} />
               </button>
            </div>
          </div>

          {/* Right: Options & Info */}
          <div className="col-span-12 lg:col-span-4 flex flex-col items-center lg:items-end justify-center z-20 order-3">
            <AnimatePresence mode="wait">
              <motion.div
                 key={`options-${activeProduct.id}`}
                 initial={{ x: 80, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 40, opacity: 0 }}
                 transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                 className="flex flex-col items-center lg:items-end"
              >
                <div className="mb-12 text-center lg:text-right">
                  <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.5em] mb-8">Format du Soin</p>
                  <div className="flex gap-5">
                    {activeProduct.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all duration-500 border ${
                          selectedOption === opt 
                            ? 'bg-white text-black border-white shadow-[0_20px_40px_rgba(255,255,255,0.2)] scale-110' 
                            : 'text-white/40 border-white/5 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="text-sm font-bold leading-none">{opt}</span>
                        <span className="text-[7px] uppercase tracking-widest mt-1 opacity-50">Units</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <Link to="#" className="flex items-center gap-4 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] group hover:text-white transition-all">
                  Guide d'utilisation
                  <div className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight size={14} />
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* ── Fixed Bottom Actions Bar ── */}
        <div className="h-32 flex items-center justify-between px-10 md:px-16 lg:px-24 border-t border-white/5 z-40 bg-white/[0.01]">
          <motion.div
            key={`price-${activeProduct.id}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-baseline gap-5"
          >
             <span 
              className={`font-display ${activeProduct.priceSize && !activeProduct.priceSize.includes('px') ? `text-${activeProduct.priceSize}` : 'text-7xl md:text-8xl'} text-white`}
              style={{ 
                color: activeProduct.priceColor || undefined,
                fontSize: activeProduct.priceSize && activeProduct.priceSize.includes('px') ? activeProduct.priceSize : undefined
              }}
             >
              {activeProduct.price}
             </span>
             <div className="flex flex-col">
                <span className="text-white/40 text-lg font-bold uppercase tracking-[0.4em]">MAD</span>
                <span className="text-white/10 text-[8px] uppercase tracking-[0.2em] font-bold">Livraison Incluse</span>
             </div>
          </motion.div>

          <div className="flex items-center gap-6 lg:gap-10">
            {/* Quantity Selector */}
            <div className="flex items-center gap-8 px-6 py-4 rounded-[1.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
              <button 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)} 
                className="text-white/30 hover:text-white transition-colors"
              >
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <span className="text-white font-display text-2xl w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="text-white/30 hover:text-white transition-colors"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Main Action Button */}
            <button 
              onClick={() => addToCart(activeProduct, quantity)}
              className="group relative overflow-hidden px-12 md:px-16 py-6 bg-white text-black font-bold uppercase tracking-[0.4em] text-[10px] rounded-[1.5rem] hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-4">
                Acheter Maintenant
                <ShoppingBag size={15} strokeWidth={2} />
              </span>
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(1.5deg); }
        }
        .perspective-1200 {
          perspective: 1200px;
        }
      `}</style>
    </section>
  );
}
