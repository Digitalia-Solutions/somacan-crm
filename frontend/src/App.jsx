import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useTheme from './hooks/useTheme';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Noise from './components/Noise';
import DynamicPage from './pages/DynamicPage';
import AdminPageEditor from './pages/admin/AdminPageEditor';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import GuestOrderAccess from './pages/GuestOrderAccess';
import ClaimOrderAccount from './pages/ClaimOrderAccount';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AccountPanelLayout from './components/account/AccountPanelLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminContent from './pages/admin/AdminContent';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminForms from './pages/admin/AdminForms';
import AdminShipping from './pages/admin/AdminShipping';
import AdminEmail from './pages/admin/AdminEmail';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminTheme from './components/admin/AdminTheme';
import AdminHeader from './pages/admin/AdminHeader';
import AdminFooter from './pages/admin/AdminFooter';
import PageBuilder2 from './components/admin/PageBuilder2';
import AdminMedia from './pages/admin/AdminMedia';
import AdminMenus from './pages/admin/AdminMenus';
import AccountOverview from './pages/account/AccountOverview';
import AccountOrders from './pages/account/AccountOrders';
import AccountWishlist from './pages/account/AccountWishlist';
import AccountProfile from './pages/account/AccountProfile';
import AccountSecurity from './pages/account/AccountSecurity';
import AccountSupport from './pages/account/AccountSupport';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { PageChromeProvider, usePageChrome } from './context/PageChromeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import NewsletterPopup from './components/NewsletterPopup';
import AdminAccessRoute from './components/AdminAccessRoute';

gsap.registerPlugin(ScrollTrigger);

function AppInner() {
  const location = useLocation();
  const { hideNavbar } = usePageChrome();
  useTheme();
  const isPreview = location.search.includes('preview=true');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideChrome = isPreview || isAdminRoute;

  useEffect(() => {
    if (hideChrome) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [hideChrome]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.querySelector(location.hash);
    if (!element) return;

    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.hash, location.pathname]);

  // WheelHero and similar self-contained heroes embed their own navbar
  const showNavbar = !hideChrome && !hideNavbar;
  const showFooter = !hideChrome;

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="relative">
            {!hideChrome && <Noise />}
            {showNavbar && <Navbar />}
            {showNavbar && <NewsletterPopup />}
            <Routes>
              <Route path="/" element={<DynamicPage slug="home" Fallback={Home} />} />
              <Route path="/about" element={<DynamicPage slug="about" Fallback={About} />} />
              <Route path="/shop" element={<DynamicPage slug="shop" Fallback={Shop} />} />
              <Route path="/blog" element={<DynamicPage slug="blog" Fallback={Blog} />} />
              <Route path="/contact" element={<DynamicPage slug="contact" Fallback={Contact} />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/shop/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/guest/orders/:id" element={<GuestOrderAccess />} />
              <Route path="/claim-account" element={<ClaimOrderAccount />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminAccessRoute><AdminLayout /></AdminAccessRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="content/edit/:slug" element={<AdminPageEditor />} />
                <Route path="pages" element={<PageBuilder2 />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="blogs/new" element={<AdminBlogEditor />} />
                <Route path="blogs/edit/:id" element={<AdminBlogEditor />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="forms" element={<AdminForms />} />
                <Route path="shipping" element={<AdminShipping />} />
                <Route path="email" element={<AdminEmail />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="theme" element={<AdminTheme />} />
                <Route path="header" element={<AdminHeader />} />
                <Route path="footer" element={<AdminFooter />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="menus" element={<AdminMenus />} />
              </Route>
              <Route
                path="/account"
                element={(
                  <ProtectedRoute>
                    <AccountPanelLayout />
                  </ProtectedRoute>
                )}
              >
                <Route index element={<AccountOverview />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="wishlist" element={<AccountWishlist />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="security" element={<AccountSecurity />} />
                <Route path="support" element={<AccountSupport />} />
              </Route>
              <Route path="/:slug" element={<DynamicPage />} />
            </Routes>
            {showFooter && <Footer />}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <ToastProvider>
      <PageChromeProvider>
        <AppInner />
      </PageChromeProvider>
    </ToastProvider>
  );
}

export default App;
