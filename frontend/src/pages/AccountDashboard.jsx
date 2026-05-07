import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Headphones,
  Heart,
  Home,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User2,
} from 'lucide-react';
import { getMyOrders, updatePassword } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const sections = [
  { id: 'overview', label: 'Vue generale', icon: LayoutDashboard },
  { id: 'orders', label: 'Mes commandes', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'profile', label: 'Mon profil', icon: User2 },
  { id: 'security', label: 'Securite', icon: ShieldCheck },
  { id: 'support', label: 'Support', icon: Headphones },
];

function formatDate(value) {
  if (!value) return 'Non disponible';

  return new Date(value).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(value) {
  const amount = Number(value);
  return `${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'} MAD`;
}

function getInitials(user) {
  return `${user?.firstName?.[0] || 'S'}${user?.lastName?.[0] || ''}`.toUpperCase();
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[1.7rem] border border-stone-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">{label}</p>
      <p className="mt-4 font-display text-4xl text-somacan-brand">{value}</p>
      <p className="mt-2 text-sm text-stone-500">{detail}</p>
    </div>
  );
}

export default function AccountDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [activeSection, setActiveSection] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState('');
  const [profileState, setProfileState] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setProfileState({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  }, [user]);

  useEffect(() => {
    let active = true;

    getMyOrders()
      .then((data) => {
        if (active) {
          setOrders(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (active) {
          setOrderError('Impossible de recuperer votre historique de commandes pour le moment.');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingOrders(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;
    const completedOrders = orders.filter((order) => order.status === 'completed').length;
    const latestOrder = orders[0] || null;
    const lastShipping = latestOrder?.customer
      ? `${latestOrder.customer.address}, ${latestOrder.customer.city}`
      : 'Ajoutez une commande pour enregistrer votre premiere adresse.';

    return {
      totalOrders,
      totalSpent,
      pendingOrders,
      completedOrders,
      latestOrder,
      lastShipping,
      wishlistCount: wishlistItems.length,
      memberSince: formatDate(user?.createdAt),
    };
  }, [orders, wishlistItems.length, user?.createdAt]);

  const recentWishlist = wishlistItems.slice(0, 4);
  const recentOrders = orders.slice(0, 4);
  const currentSection = sections.find((section) => section.id === activeSection) || sections[0];

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileState((current) => ({ ...current, [name]: value }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');

    try {
      await updateProfile(profileState);
      setProfileMessage('Profil mis a jour avec succes.');
    } catch (error) {
      setProfileError(error.message || 'Impossible de mettre a jour votre profil.');
    } finally {
      setProfileSaving(false);
    }
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordState((current) => ({ ...current, [name]: value }));
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage('');
    setPasswordError('');

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordSaving(false);
      setPasswordError('La confirmation du nouveau mot de passe ne correspond pas.');
      return;
    }

    try {
      const data = await updatePassword({
        currentPassword: passwordState.currentPassword,
        newPassword: passwordState.newPassword,
      });
      setPasswordMessage(data.message || 'Mot de passe mis a jour.');
      setPasswordState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setPasswordError(error.message || 'Impossible de modifier le mot de passe.');
    } finally {
      setPasswordSaving(false);
    }
  }

  function renderOverview() {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Commandes" value={stats.totalOrders} detail="Toutes vos commandes enregistrees." />
          <StatCard label="Montant total" value={formatCurrency(stats.totalSpent)} detail="Total depense sur votre compte." />
          <StatCard label="En attente" value={stats.pendingOrders} detail="Commandes en cours de traitement." />
          <StatCard label="Wishlist" value={stats.wishlistCount} detail="Produits sauvegardes pour plus tard." />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Commande recente</p>
                <h2 className="mt-2 font-display text-3xl text-somacan-brand">Activite recente</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('orders')}
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
              >
                Voir tout
                <ChevronRight size={16} />
              </button>
            </div>

            {loadingOrders && (
              <div className="mt-6 rounded-[1.5rem] bg-stone-50 p-5 text-stone-500">
                Chargement des commandes...
              </div>
            )}

            {!loadingOrders && orderError && (
              <div className="mt-6 rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-red-700">
                {orderError}
              </div>
            )}

            {!loadingOrders && !orderError && recentOrders.length === 0 && (
              <div className="mt-6 rounded-[1.5rem] bg-stone-50 p-6">
                <Package className="text-gold-500" size={20} />
                <p className="mt-4 text-lg text-stone-900">Aucune commande pour le moment.</p>
                <p className="mt-2 text-sm leading-7 text-stone-500">
                  Passez votre premiere commande pour voir son suivi ici.
                </p>
              </div>
            )}

            {!loadingOrders && !orderError && recentOrders.length > 0 && (
              <div className="mt-6 space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="rounded-[1.5rem] bg-stone-50 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Commande #{order.id}</p>
                        <p className="mt-3 font-display text-2xl text-somacan-brand">{formatCurrency(order.totalAmount)}</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
                          <Clock3 size={14} />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-stone-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                          {order.status}
                        </span>
                        <span className="rounded-full bg-gold-500/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-700">
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Compte</p>
            <h2 className="mt-2 font-display text-3xl text-somacan-brand">Resume client</h2>

            <div className="mt-6 rounded-[1.6rem] bg-stone-900 p-5 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(201,170,115,0.35),rgba(4,57,32,0.96))] font-display text-2xl">
                  {getInitials(user)}
                </div>
                <div>
                  <p className="font-display text-2xl">{user?.firstName} {user?.lastName}</p>
                  <p className="mt-1 text-sm text-stone-300">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-[1.4rem] bg-stone-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Membre depuis</p>
                <p className="mt-2 text-sm text-stone-700">{stats.memberSince}</p>
              </div>
              <div className="rounded-[1.4rem] bg-stone-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Adresse recente</p>
                <p className="mt-2 text-sm leading-7 text-stone-700">{stats.lastShipping}</p>
              </div>
              <div className="rounded-[1.4rem] bg-stone-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Telephone</p>
                <p className="mt-2 text-sm text-stone-700">{user?.phone || 'Non renseigne'}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  function renderOrders() {
    return (
      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Historique</p>
            <h2 className="mt-2 font-display text-3xl text-somacan-brand">Mes commandes</h2>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900">
            Continuer mes achats
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Total" value={stats.totalOrders} detail="Toutes vos commandes." />
          <StatCard label="En attente" value={stats.pendingOrders} detail="En traitement actuellement." />
          <StatCard label="Terminees" value={stats.completedOrders} detail="Commandes finalisees." />
        </div>

        <div className="mt-6 space-y-4">
          {loadingOrders && (
            <div className="rounded-[1.5rem] bg-stone-50 p-5 text-stone-500">
              Chargement des commandes...
            </div>
          )}

          {!loadingOrders && orderError && (
            <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-red-700">
              {orderError}
            </div>
          )}

          {!loadingOrders && !orderError && orders.length === 0 && (
            <div className="rounded-[1.5rem] bg-stone-50 p-6">
              <Package className="text-gold-500" size={20} />
              <p className="mt-4 text-lg text-stone-900">Aucune commande enregistree.</p>
              <p className="mt-2 text-sm leading-7 text-stone-500">Votre historique apparaitra ici automatiquement.</p>
            </div>
          )}

          {!loadingOrders && !orderError && orders.map((order) => (
            <div key={order.id} className="rounded-[1.6rem] bg-stone-50 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Commande #{order.id}</p>
                  <p className="mt-3 font-display text-2xl text-somacan-brand">{formatCurrency(order.totalAmount)}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
                    <Clock3 size={14} />
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-stone-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-gold-500/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-700">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {order.items.map((item, index) => (
                  <div key={`${order.id}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderWishlist() {
    return (
      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Favoris</p>
            <h2 className="mt-2 font-display text-3xl text-somacan-brand">Ma wishlist</h2>
          </div>
          <Link to="/wishlist" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900">
            Ouvrir la page wishlist
            <ChevronRight size={16} />
          </Link>
        </div>

        {recentWishlist.length === 0 ? (
          <div className="mt-6 rounded-[1.6rem] bg-stone-50 p-6">
            <Heart className="text-[#043920]" size={20} />
            <p className="mt-4 text-lg text-stone-900">Aucun produit sauvegarde.</p>
            <p className="mt-2 text-sm leading-7 text-stone-500">
              Ajoutez des produits depuis les cartes produits pour les retrouver ici.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {recentWishlist.map((item) => (
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

  function renderProfile() {
    return (
      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#043920] text-white shadow-[0_12px_28px_rgba(4,57,32,0.18)]">
            <User2 size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Informations personnelles</p>
            <h2 className="mt-2 font-display text-3xl text-somacan-brand">Mon profil</h2>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Prenom</span>
              <input
                name="firstName"
                value={profileState.firstName}
                onChange={handleProfileChange}
                className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Nom</span>
              <input
                name="lastName"
                value={profileState.lastName}
                onChange={handleProfileChange}
                className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Email</span>
              <input
                name="email"
                type="email"
                value={profileState.email}
                onChange={handleProfileChange}
                className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Telephone</span>
              <input
                name="phone"
                value={profileState.phone}
                onChange={handleProfileChange}
                className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
              />
            </label>
          </div>

          {profileMessage && (
            <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} />
                {profileMessage}
              </div>
            </div>
          )}

          {profileError && (
            <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {profileError}
            </div>
          )}

          <button type="submit" disabled={profileSaving} className="btn-luxury btn-luxury-primary justify-center sm:w-fit">
            {profileSaving ? 'Mise a jour...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </section>
    );
  }

  function renderSecurity() {
    return (
      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white">
            <KeyRound size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Acces</p>
            <h2 className="mt-2 font-display text-3xl text-somacan-brand">Securite du compte</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Session" value="Active" detail="Connecte sur cet appareil." />
          <StatCard label="Mot de passe" value="Protege" detail="Modification disponible ici." />
          <StatCard label="Email" value="Verifie" detail="Utilise pour vos commandes." />
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Mot de passe actuel</span>
            <input
              name="currentPassword"
              type="password"
              value={passwordState.currentPassword}
              onChange={handlePasswordChange}
              className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Nouveau mot de passe</span>
              <input
                name="newPassword"
                type="password"
                value={passwordState.newPassword}
                onChange={handlePasswordChange}
                className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Confirmation</span>
              <input
                name="confirmPassword"
                type="password"
                value={passwordState.confirmPassword}
                onChange={handlePasswordChange}
                className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
              />
            </label>
          </div>

          {passwordMessage && (
            <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {passwordError}
            </div>
          )}

          <button type="submit" disabled={passwordSaving} className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit">
            {passwordSaving ? 'Mise a jour...' : 'Changer le mot de passe'}
          </button>
        </form>
      </section>
    );
  }

  function renderSupport() {
    return (
      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/20 text-somacan-brand">
            <Headphones size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Assistance</p>
            <h2 className="mt-2 font-display text-3xl text-somacan-brand">Centre client</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link to="/contact" className="rounded-[1.6rem] bg-stone-50 p-5 transition-transform hover:-translate-y-0.5">
            <Mail className="text-[#043920]" size={18} />
            <p className="mt-4 font-display text-2xl text-somacan-brand">Contact</p>
            <p className="mt-2 text-sm leading-7 text-stone-500">Envoyez-nous votre demande directement.</p>
          </Link>
          <Link to="/shop" className="rounded-[1.6rem] bg-stone-50 p-5 transition-transform hover:-translate-y-0.5">
            <ShoppingBag className="text-[#043920]" size={18} />
            <p className="mt-4 font-display text-2xl text-somacan-brand">Boutique</p>
            <p className="mt-2 text-sm leading-7 text-stone-500">Continuez vos achats et decouvrez de nouveaux produits.</p>
          </Link>
          <button
            type="button"
            onClick={() => setActiveSection('orders')}
            className="rounded-[1.6rem] bg-stone-50 p-5 text-left transition-transform hover:-translate-y-0.5"
          >
            <Package className="text-[#043920]" size={18} />
            <p className="mt-4 font-display text-2xl text-somacan-brand">Suivi</p>
            <p className="mt-2 text-sm leading-7 text-stone-500">Accedez rapidement a l historique de commandes.</p>
          </button>
        </div>

        <div className="mt-6 rounded-[1.6rem] border border-stone-200 bg-[#fcfaf7] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Informations utiles</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.4rem] bg-white p-4">
              <div className="flex items-center gap-3 text-stone-500">
                <Phone size={16} />
                <span className="text-sm">Telephone client</span>
              </div>
              <p className="mt-3 text-sm text-stone-700">Disponible selon les coordonnees renseignees sur la page contact.</p>
            </div>
            <div className="rounded-[1.4rem] bg-white p-4">
              <div className="flex items-center gap-3 text-stone-500">
                <MapPin size={16} />
                <span className="text-sm">Adresse de livraison</span>
              </div>
              <p className="mt-3 text-sm text-stone-700">{stats.lastShipping}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderSection() {
    switch (activeSection) {
      case 'orders':
        return renderOrders();
      case 'wishlist':
        return renderWishlist();
      case 'profile':
        return renderProfile();
      case 'security':
        return renderSecurity();
      case 'support':
        return renderSupport();
      case 'overview':
      default:
        return renderOverview();
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(201,170,115,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(4,57,32,0.07),transparent_28%),#f8f4ee] pb-24 pt-28">
      <div className="section-padding mx-auto max-w-[90vw]">
        <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="overflow-hidden rounded-[2.2rem] bg-stone-900 text-white shadow-[0_24px_80px_rgba(28,25,23,0.16)]">
              <div className="border-b border-white/10 px-6 py-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(201,170,115,0.35),rgba(4,57,32,0.96))] font-display text-2xl">
                    {getInitials(user)}
                  </div>
                  <div>
                    <p className="font-display text-2xl">{user?.firstName}</p>
                    <p className="mt-1 text-sm text-stone-400">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="grid gap-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors ${
                          isActive ? 'bg-white text-stone-900' : 'text-stone-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={17} />
                          <span className="text-sm font-medium">{section.label}</span>
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 px-4 py-4">
                <div className="grid gap-2">
                  <Link
                    to="/"
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Home size={17} />
                    Retour a l accueil
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <LogOut size={17} />
                    Deconnexion
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <section className="grid gap-6">
            <div className="rounded-[2.2rem] border border-stone-200/70 bg-white/82 px-6 py-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)] backdrop-blur-sm md:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">Dashboard client</p>
                  <h1 className="mt-3 font-display text-4xl leading-[0.92] text-somacan-brand md:text-6xl">
                    {currentSection.label}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500">
                    Un espace client structure comme un vrai panel: navigation laterale, acces rapide a vos commandes, vos favoris, votre profil et la securite du compte.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/shop" className="btn-luxury btn-luxury-primary">
                    Explorer la boutique
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveSection('orders')}
                    className="btn-luxury border border-stone-200 bg-white text-stone-700 hover:border-stone-900 hover:text-stone-900"
                  >
                    Voir mes commandes
                  </button>
                </div>
              </div>
            </div>

            {renderSection()}
          </section>
        </div>
      </div>
    </main>
  );
}
