import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Clock3, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { submitContactForm } from '../lib/api';

const revealUp = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const DEFAULT_SERVICE_MOMENTS = [
  'Conseils produits et routines personnalisees',
  'Suivi de commande et informations livraison',
  'Demandes presse, collaborations et wholesale',
];

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: 'Conseil produit',
  message: '',
};

export default function ContactForm({
  sidebarTitle = 'Parlons du bon sujet, au bon moment.',
  sidebarEyebrow = 'Quand nous contacter',
  serviceMoments = DEFAULT_SERVICE_MOMENTS,
  hoursLabel = 'Lundi au samedi, 9h00 a 19h00',
  socialEyebrow = 'Restez proches',
  formEyebrow = 'Formulaire',
  formTitle = 'Envoyez-nous',
  formTitleLine2 = 'votre message.',
  formBadge = 'Reponse humaine',
  idleNote = 'Nous lisons chaque message avec attention et sans reponse automatique impersonnelle.',
  submitLabel = 'Envoyer le message',
}) {
  const [form, setForm] = useState(INITIAL_FORM);
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
      setForm(INITIAL_FORM);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="section-padding pt-24 pb-0 bg-[#fcfaf7]">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">

        {/* Left sidebar */}
        <motion.div {...revealUp} className="space-y-6">
          {/* Dark moments card */}
          <div className="rounded-[2.3rem] bg-stone-900 p-8 text-stone-100 shadow-[0_24px_80px_rgba(28,25,23,0.16)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-500">
              {sidebarEyebrow}
            </p>
            <h2 className="mt-4 font-display text-4xl text-white">{sidebarTitle}</h2>
            <div className="mt-8 space-y-4">
              {serviceMoments.map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-5 py-4">
                  <p className="text-sm font-light leading-7 text-stone-300">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-stone-400">
              <Clock3 size={16} className="text-stone-500" />
              {hoursLabel}
            </div>
          </div>

          {/* Social links card */}
          <div className="rounded-[2.1rem] border border-stone-200 bg-white/80 p-7 shadow-[0_18px_60px_rgba(28,25,23,0.05)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-stone-400">{socialEyebrow}</p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-stone-400 hover:text-stone-700"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-stone-400 hover:text-stone-700"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-stone-400 hover:text-stone-700"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right: full form */}
        <motion.div
          id="contact-form"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          className="rounded-[2rem] md:rounded-[2.6rem] border border-stone-200/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(28,25,23,0.06)] backdrop-blur-sm md:p-10"
        >
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-stone-400">{formEyebrow}</p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-somacan-brand md:text-5xl">
                {formTitle}
                <br />
                {formTitleLine2}
              </h2>
            </div>
            <div className="hidden rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500 md:block">
              {formBadge}
            </div>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            {/* First name / Last name */}
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Prenom</span>
                <input
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Votre prenom"
                  className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Nom</span>
                <input
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Votre nom"
                  className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
            </div>

            {/* Email / Phone */}
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="vous@exemple.com"
                  className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Telephone</span>
                <input
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+212 ..."
                  className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
            </div>

            {/* Subject */}
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Sujet</span>
              <select
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920]"
              >
                <option>Conseil produit</option>
                <option>Commande et livraison</option>
                <option>Partenariat</option>
                <option>Presse et image</option>
                <option>Autre demande</option>
              </select>
            </label>

            {/* Message */}
            <label className="grid gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Message</span>
              <textarea
                rows={7}
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Dites-nous ce dont vous avez besoin, votre contexte, ou le type de produit qui vous interesse."
                className="rounded-[1.7rem] border border-stone-200 bg-[#fcfaf7] px-5 py-4 text-sm text-stone-700 outline-none transition-colors focus:border-[#043920] resize-none"
              />
            </label>

            {/* Submit row */}
            <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
              <div>
                {status === 'success' && (
                  <p className="text-sm text-emerald-600">
                    Votre message a bien ete envoye.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-sm text-red-500">
                    Merci de remplir les champs requis ou de reessayer dans un instant.
                  </p>
                )}
                {status === 'idle' && (
                  <p className="text-sm text-stone-500">{idleNote}</p>
                )}
              </div>
              <button type="submit" className="btn-luxury btn-luxury-primary shrink-0">
                {submitLabel}
                <Send size={14} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
