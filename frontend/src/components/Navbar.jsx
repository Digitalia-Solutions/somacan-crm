import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, LogIn, UserPlus, User2, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';
import useHeaderSettings from '../hooks/useHeaderSettings';

const logoDark = new URL('../public/asset/cropped-LOGO_SOMACAN_SHOP__1_-removebg-preview.webp', import.meta.url).href;

// Hardcoded constants for styling (not from backend)
const NAV_ITEM_GAP = '40px';
const NAV_FONT_SIZE = '11px';
const NAV_LETTER_SPACING = '0.3em';
const ICON_SIZE = '20px';
const MOBILE_NAV_FONT_SIZE = '28px';
const TOP_PADDING = '16px';
const STICKY_TOP_PADDING = '12px';
const LOGO_HEIGHT = '48px';
const MOBILE_LOGO_HEIGHT = '40px';
const HOVER_BACKGROUND_COLOR = 'rgba(245,245,244,0.7)';
const NAV_MAX_WIDTH = '100%';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { header, loading } = useHeaderSettings();
  const { totalItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (loading) return null;

  const isHome = location.pathname === '/';
  const stickyActive = header.settings.sticky ? scrolled : false;
  const shouldHide = Boolean(header.settings.hideOnHomeTop && isHome && !scrolled);
  const activeLogo = header.logo.src || logoDark;
  const navBackground = stickyActive ? header.theme.stickyBackgroundColor : header.theme.backgroundColor;
  const navLinkColor = stickyActive ? header.theme.stickyTextColor : header.theme.textColor;
  const navIconColor = stickyActive ? header.theme.stickyIconColor : header.theme.iconColor;
  const navPadding = stickyActive ? STICKY_TOP_PADDING : TOP_PADDING;
  const navShadow = stickyActive ? `0 10px 30px ${header.theme.shadowColor}` : 'none';

  return (
    <nav className="cms-navbar">
      <style>{`.cms-navbar .nav-icon-btn:hover{background:${HOVER_BACKGROUND_COLOR};}`}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transform: shouldHide ? 'translateY(-100%)' : 'translateY(0)',
          opacity: shouldHide ? 0 : 1,
          pointerEvents: shouldHide ? 'none' : 'auto',
          transition: 'transform 0.7s ease, opacity 0.7s ease, background-color 0.7s ease, box-shadow 0.7s ease',
          backgroundColor: navBackground,
          backdropFilter: `blur(${header.theme.backdropBlur})`,
          WebkitBackdropFilter: `blur(${header.theme.backdropBlur})`,
          boxShadow: navShadow,
          paddingTop: `max(${navPadding}, env(safe-area-inset-top))`,
          paddingBottom: navPadding,
        }}
      >
      <div className="section-padding flex items-center justify-between" style={{ maxWidth: NAV_MAX_WIDTH, margin: '0 auto' }}>
        <Link to="/" className="flex items-center group">
          <img
            src={activeLogo}
            alt={header.logo.alt || 'Somacan'}
            className="w-auto transition-all duration-700 group-hover:scale-105"
            style={{
              height: `min(${LOGO_HEIGHT}, 12vw)`,
            }}
          />
        </Link>

        <div className="hidden md:flex items-center" style={{ gap: NAV_ITEM_GAP }}>
          {header.navLinks.map((item) => {
            const isActive = item.href === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.href);

            return item.isExternal ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative font-bold uppercase transition-colors group"
                style={{ color: navLinkColor, fontSize: NAV_FONT_SIZE, letterSpacing: NAV_LETTER_SPACING }}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ backgroundColor: navLinkColor }} />
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="relative font-bold uppercase transition-colors group"
                style={{ color: navLinkColor, fontSize: NAV_FONT_SIZE, letterSpacing: NAV_LETTER_SPACING }}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ backgroundColor: navLinkColor }} />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {header.ctaButton.label && (
            <Link
              to={header.ctaButton.href}
              className={`hidden md:inline-flex btn-luxury btn-luxury-${header.ctaButton.variant || 'primary'} text-xs px-4 py-2`}
            >
              {header.ctaButton.label}
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/account" className="nav-icon-btn hidden md:flex rounded-full p-2 transition-colors" aria-label="Mon compte">
                <User2 className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="nav-icon-btn hidden md:flex rounded-full p-2 transition-colors"
                aria-label="Deconnexion"
              >
                <LogOut className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-icon-btn hidden md:flex rounded-full p-2 transition-colors" aria-label="Connexion">
                <LogIn className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
              </Link>
              <Link to="/register" className="nav-icon-btn hidden md:flex rounded-full p-2 transition-colors" aria-label="Inscription">
                <UserPlus className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
              </Link>
            </>
          )}
          <Link to="/wishlist" className="nav-icon-btn relative rounded-full p-2 transition-colors" aria-label="Wishlist">
            <Heart className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
          </Link>
          <Link to="/cart" className="nav-icon-btn relative rounded-full p-2 transition-colors" aria-label="Panier">
            <ShoppingBag className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[#fcfaf7] text-[8px] rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: navIconColor }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-full p-2"
            style={{ backgroundColor: 'transparent' }}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: navIconColor, width: ICON_SIZE, height: ICON_SIZE }} />
            )}
          </button>
        </div>
      </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-panel"
            className="fixed inset-0 z-[100] md:hidden bg-stone-900 flex flex-col overflow-hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Background Texture/Shine */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-somacan-brand/30 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-gold-600/10 blur-[100px] rounded-full" />
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-6 py-5 shrink-0">
              <img
                src={activeLogo}
                alt={header.logo.alt || 'Somacan'}
                className="w-auto invert brightness-0"
                style={{ height: MOBILE_LOGO_HEIGHT }}
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav links */}
            <div className="relative z-10 flex-1 overflow-y-auto px-10 py-12 flex flex-col justify-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-4">Menu Principal</p>
              {header.navLinks.map((item, index) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block font-display text-5xl transition-all ${
                        isActive ? 'text-white italic ml-4' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom actions */}
            <motion.div
              className="relative z-10 shrink-0 px-10 py-10 border-t border-white/5 bg-white/[0.02] backdrop-blur-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isAuthenticated ? (
                    <Link
                      to="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-full border border-white/10 w-14 h-14 bg-white/5 text-white hover:bg-white/10 transition-colors"
                    >
                      <User2 size={22} />
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-full border border-white/10 w-14 h-14 bg-white/5 text-white hover:bg-white/10 transition-colors"
                    >
                      <LogIn size={22} />
                    </Link>
                  )}
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-full border border-white/10 w-14 h-14 bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    <Heart size={22} />
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileOpen(false)}
                    className="relative flex items-center justify-center rounded-full border border-white/10 w-14 h-14 bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    <ShoppingBag size={22} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[10px] rounded-full flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
                <Link 
                  to="/shop" 
                  onClick={() => setMobileOpen(false)}
                  className="bg-white text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px]"
                >
                  Boutique
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
