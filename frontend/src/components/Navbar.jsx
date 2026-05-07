import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
const MOBILE_NAV_FONT_SIZE = '40px';
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
          paddingTop: navPadding,
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
          {header.navLinks.map((item) => (
            item.isExternal ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative font-bold uppercase transition-colors group"
                style={{ color: navLinkColor, fontSize: NAV_FONT_SIZE, letterSpacing: NAV_LETTER_SPACING }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full" style={{ backgroundColor: navLinkColor }} />
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className="relative font-bold uppercase transition-colors group"
                style={{ color: navLinkColor, fontSize: NAV_FONT_SIZE, letterSpacing: NAV_LETTER_SPACING }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full" style={{ backgroundColor: navLinkColor }} />
              </Link>
            )
          ))}
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

      {mobileOpen && (
        <div className="md:hidden absolute top-0 left-0 right-0 h-screen z-[60] flex flex-col" style={{ backgroundColor: header.theme.mobileBackgroundColor || '#ffffff' }}>
          <div className="section-padding py-8 flex justify-between items-center border-b border-stone-50">
            <img
              src={activeLogo}
              alt={header.logo.alt || 'Somacan'}
              className="w-auto"
              style={{ height: MOBILE_LOGO_HEIGHT }}
            />
            <button onClick={() => setMobileOpen(false)} className="p-2">
              <X className="w-6 h-6" style={{ color: header.theme.stickyIconColor || header.theme.iconColor }} />
            </button>
          </div>
          <div className="section-padding py-12 flex flex-col gap-8">
            {header.navLinks.map((item) => (
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="font-display border-b border-stone-50 pb-4"
                  style={{ color: header.theme.stickyTextColor || header.theme.textColor, fontSize: MOBILE_NAV_FONT_SIZE }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display border-b border-stone-50 pb-4"
                  style={{ color: header.theme.stickyTextColor || header.theme.textColor, fontSize: MOBILE_NAV_FONT_SIZE }}
                >
                  {item.label}
                </Link>
              )
            ))}
            <div className="flex items-center gap-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                    <User2 className="w-5 h-5" style={{ color: header.theme.stickyIconColor || header.theme.iconColor }} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="rounded-full border border-stone-200 p-3"
                  >
                    <LogOut className="w-5 h-5" style={{ color: header.theme.stickyIconColor || header.theme.iconColor }} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                    <LogIn className="w-5 h-5" style={{ color: header.theme.stickyIconColor || header.theme.iconColor }} />
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                    <UserPlus className="w-5 h-5" style={{ color: header.theme.stickyIconColor || header.theme.iconColor }} />
                  </Link>
                </>
              )}
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                <Heart className="w-5 h-5" style={{ color: header.theme.stickyIconColor || header.theme.iconColor }} />
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="rounded-full border border-stone-200 p-3">
                <ShoppingBag className="w-5 h-5" style={{ color: header.theme.stickyIconColor || header.theme.iconColor }} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
