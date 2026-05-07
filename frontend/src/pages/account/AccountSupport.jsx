import { Link, useOutletContext } from 'react-router-dom';
import { Headphones, Mail, MapPin, Package, Phone, ShoppingBag } from 'lucide-react';

export default function AccountSupport() {
  const { stats } = useOutletContext();

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
        <Link to="/account/orders" className="rounded-[1.6rem] bg-stone-50 p-5 transition-transform hover:-translate-y-0.5">
          <Package className="text-[#043920]" size={18} />
          <p className="mt-4 font-display text-2xl text-somacan-brand">Suivi</p>
          <p className="mt-2 text-sm leading-7 text-stone-500">Accedez rapidement a l historique de commandes.</p>
        </Link>
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
