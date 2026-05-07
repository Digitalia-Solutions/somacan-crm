import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock3, ArrowRight, Send, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { submitContactForm } from '../lib/api';

const contactHero = new URL('../public/asset/Soins de bien-être élégants et naturels.png', import.meta.url).href;

const contactCards = [
  {
    icon: Phone,
    label: 'Telephone',
    value: '+212 5XX-XXXXXX',
    detail: 'Lundi au samedi, 9h00 a 19h00',
    href: 'tel:+212500000000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@somacan.ma',
    detail: 'Reponse moyenne en moins de 24h',
    href: 'mailto:contact@somacan.ma',
  },
  {
    icon: MapPin,
    label: 'Showroom',
    value: 'Casablanca, Maroc',
    detail: 'Rendez-vous prive sur demande',
    href: '#map',
  },
];

const serviceMoments = [
  'Conseils produits et routines personnalisees',
  'Suivi de commande et informations livraison',
  'Demandes presse, collaborations et wholesale',
];

const faqs = [
  {
    title: 'Je ne sais pas quel produit choisir.',
    text: "Dites-nous votre besoin, votre type de peau et votre routine actuelle. Nous vous orienterons vers une selection claire, sans surcharge.",
  },
  {
    title: 'Puis-je prendre rendez-vous ?',
    text: "Oui. Pour les demandes premium, presse ou partenariats, nous pouvons organiser un echange prive en visio ou a Casablanca.",
  },
  {
    title: 'Le formulaire envoie-t-il un vrai message ?',
    text: "Le formulaire est pret cote interface. Il valide les champs et affiche une confirmation locale. Nous pouvons le connecter a votre backend ou a un service email ensuite.",
  },
];

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: 'Conseil produit',
  message: '',
};

const revealUp = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.message) {
      setStatus('error');
      return;
    }

    try {
      await submitContactForm(form);
      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] pb-24 pt-24">
      <section className="section-padding">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <motion.div {...revealUp}>
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.46em] text-stone-400">
              Contact
            </p>
            <h1 className="font-display text-5xl leading-[0.88] text-somacan-brand md:text-8xl">
              Une conversation
              <br />
              <span className="font-light italic text-stone-400">calme et precise.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[17px] font-light leading-8 text-stone-600">
              Que vous ayez une question sur une routine, un besoin de recommandation, un suivi de commande ou une demande de collaboration, nous vous repondons avec le meme niveau d'attention que nos soins.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#contact-form" className="btn-luxury btn-luxury-primary">
                Ecrire maintenant
                <ArrowRight size={14} />
              </a>
              <a href="#map" className="btn-luxury btn-luxury-outline">
                Voir la localisation
              </a>
            </div>

            <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
              {contactCards.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="rounded-[1.8rem] border border-stone-200/70 bg-white/75 p-6 shadow-[0_18px_60px_rgba(28,25,23,0.05)] backdrop-blur-sm"
                >
                  <item.icon className="mb-5 text-gold-500" size={20} strokeWidth={1.8} />
                  <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-stone-400">{item.label}</p>
                  <p className="mt-3 text-lg leading-tight text-somacan-brand">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{item.detail}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...revealUp}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2.8rem] shadow-[0_32px_100px_rgba(28,25,23,0.14)]">
              <img src={contactHero} alt="Univers de contact Somacan" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-x-6 bottom-6 rounded-[1.8rem] border border-white/60 bg-white/82 p-6 backdrop-blur-xl shadow-[0_18px_40px_rgba(28,25,23,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-stone-400">Disponibilite</p>
                  <p className="mt-2 font-display text-2xl leading-tight text-somacan-brand">
                    Une equipe attentive,
                    <br />
                    sans script automatique.
                  </p>
                </div>
                <div className="rounded-full bg-[#043920] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                  Reponse rapide
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <motion.div {...revealUp} className="space-y-6">
            <div className="rounded-[2.3rem] bg-stone-900 p-8 text-stone-100 shadow-[0_24px_80px_rgba(28,25,23,0.16)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-500">Quand nous contacter</p>
              <h2 className="mt-4 font-display text-4xl text-white">Parlons du bon sujet, au bon moment.</h2>
              <div className="mt-8 space-y-4">
                {serviceMoments.map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-5 py-4">
                    <p className="text-sm font-light leading-7 text-stone-300">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-stone-400">
                <Clock3 size={16} className="text-gold-500" />
                Lundi au samedi, 9h00 a 19h00
              </div>
            </div>

            <div className="rounded-[2.1rem] border border-stone-200 bg-white/80 p-7 shadow-[0_18px_60px_rgba(28,25,23,0.05)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-stone-400">Restez proches</p>
              <div className="mt-5 flex gap-3">
                <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-gold-400 hover:text-gold-500">
                  <Instagram size={18} />
                </a>
                <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-gold-400 hover:text-gold-500">
                  <Facebook size={18} />
                </a>
                <a href="#" className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-gold-400 hover:text-gold-500">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            id="contact-form"
            {...revealUp}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            className="rounded-[2.6rem] border border-stone-200/70 bg-white/82 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.06)] backdrop-blur-sm md:p-10"
          >
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">Formulaire</p>
                <h2 className="mt-3 font-display text-4xl leading-tight text-somacan-brand md:text-5xl">
                  Envoyez-nous
                  <br />
                  votre message.
                </h2>
              </div>
              <div className="hidden rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500 md:block">
                Reponse humaine
              </div>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Prenom</span>
                  <input
                    value={form.firstName}
                    onChange={(event) => updateField('firstName', event.target.value)}
                    className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                    placeholder="Votre prenom"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Nom</span>
                  <input
                    value={form.lastName}
                    onChange={(event) => updateField('lastName', event.target.value)}
                    className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                    placeholder="Votre nom"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                    placeholder="vous@exemple.com"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Telephone</span>
                  <input
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                    placeholder="+212 ..."
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Sujet</span>
                <select
                  value={form.subject}
                  onChange={(event) => updateField('subject', event.target.value)}
                  className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                >
                  <option>Conseil produit</option>
                  <option>Commande et livraison</option>
                  <option>Partenariat</option>
                  <option>Presse et image</option>
                  <option>Autre demande</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Message</span>
                <textarea
                  rows={7}
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className="rounded-[1.7rem] border border-stone-200 bg-[#fcfaf7] px-5 py-4 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920] resize-none"
                  placeholder="Dites-nous ce dont vous avez besoin, votre contexte, ou le type de produit qui vous interesse."
                />
              </label>

              <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
                <div>
                  {status === 'success' && (
                    <p className="text-sm text-emerald-600">Votre message a bien ete envoye et remonte maintenant dans le panneau admin.</p>
                  )}
                  {status === 'error' && (
                    <p className="text-sm text-red-500">Merci de remplir les champs requis ou de reessayer dans un instant.</p>
                  )}
                  {status === 'idle' && (
                    <p className="text-sm text-stone-500">Nous lisons chaque message avec attention et sans reponse automatique impersonnelle.</p>
                  )}
                </div>

                <button type="submit" className="btn-luxury btn-luxury-primary shrink-0">
                  Envoyer le message
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <section id="map" className="section-padding pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...revealUp}>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">Localisation</p>
            <h2 className="font-display text-4xl leading-tight text-somacan-brand md:text-6xl">
              Retrouvez
              <br />
              <span className="font-light italic text-stone-400">Somacan a Casablanca.</span>
            </h2>
            <p className="mt-8 max-w-xl text-[17px] font-light leading-8 text-stone-600">
              Notre univers est pense comme une experience plus qu'un simple point de contact. Utilisez la carte pour nous situer et organiser un echange, une visite ou un retrait selon votre besoin.
            </p>
          </motion.div>

          <motion.div
            {...revealUp}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="overflow-hidden rounded-[2.7rem] border border-stone-200 bg-white p-3 shadow-[0_24px_80px_rgba(28,25,23,0.06)]"
          >
            <iframe
              title="Somacan Casablanca map"
              src="https://www.google.com/maps?q=Casablanca%2C%20Morocco&z=12&output=embed"
              className="h-[460px] w-full rounded-[2rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      <section className="section-padding pt-24">
        <div className="mx-auto max-w-7xl rounded-[2.8rem] bg-stone-900 px-8 py-10 text-stone-100 shadow-[0_24px_80px_rgba(28,25,23,0.16)] md:px-12 md:py-14">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-stone-500">Questions frequentes</p>
              <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">Avant de nous ecrire.</h2>
            </div>
            <p className="max-w-xl text-sm font-light leading-7 text-stone-400">
              Quelques clarifications utiles pour garder l'echange fluide et rapide.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6">
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-4 text-sm font-light leading-7 text-stone-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
