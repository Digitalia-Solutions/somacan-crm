import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const ICON_MAP = { Phone, Mail, MapPin };

const revealUp = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const DEFAULT_CARDS = [
  { icon: 'Phone', label: 'Telephone', value: '+212 5XX-XXXXXX', detail: 'Lundi au samedi, 9h00 a 19h00', href: 'tel:+212500000000' },
  { icon: 'Mail', label: 'Email', value: 'contact@somacan.ma', detail: 'Reponse moyenne en moins de 24h', href: 'mailto:contact@somacan.ma' },
  { icon: 'MapPin', label: 'Showroom', value: 'Casablanca, Maroc', detail: 'Rendez-vous prive sur demande', href: '#map' },
];

export default function ContactHero({
  eyebrow = 'Contact',
  title = 'Une conversation',
  titleItalic = 'calme et precise.',
  description = "Que vous ayez une question sur une routine, un besoin de recommandation, un suivi de commande ou une demande de collaboration, nous vous repondons avec le meme niveau d'attention que nos soins.",
  ctaPrimaryText = 'Ecrire maintenant',
  ctaPrimaryHref = '#contact-form',
  ctaSecondaryText = 'Voir la localisation',
  ctaSecondaryHref = '#map',
  cards = DEFAULT_CARDS,
  heroImage = '',
  overlayTitle = 'Une equipe attentive,',
  overlaySubtitle = 'sans script automatique.',
  overlayBadge = 'Reponse rapide',
}) {
  return (
    <section className="min-h-screen bg-[#fcfaf7] pb-0 pt-24 section-padding">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">

        {/* Left column */}
        <motion.div {...revealUp}>
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.46em] text-stone-400">
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl leading-[0.88] text-somacan-brand md:text-6xl lg:text-8xl">
            {title}
            <br />
            <span className="font-light italic text-stone-400">{titleItalic}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] font-light leading-8 text-stone-600">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href={ctaPrimaryHref} className="btn-luxury btn-luxury-primary">
              {ctaPrimaryText}
              <ArrowRight size={14} />
            </a>
            <a href={ctaSecondaryHref} className="btn-luxury btn-luxury-outline">
              {ctaSecondaryText}
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
            {cards.map((item, index) => {
              const Icon = ICON_MAP[item.icon];
              return (
                <motion.a
                  key={item.label}
                  href={item.href || '#'}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="rounded-[1.8rem] border border-stone-200/70 bg-white/75 p-6 shadow-[0_18px_60px_rgba(28,25,23,0.05)] backdrop-blur-sm"
                >
                  {Icon && <Icon className="mb-5 text-stone-700" size={20} strokeWidth={1.8} />}
                  <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-stone-400">{item.label}</p>
                  <p className="mt-3 text-lg leading-tight text-somacan-brand">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{item.detail}</p>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Right column — hero image with glassmorphism overlay */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2.8rem] shadow-[0_32px_100px_rgba(28,25,23,0.14)]">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Univers de contact Somacan"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-[320px] md:h-[560px] w-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-24 w-24 mx-auto rounded-full bg-white/60 flex items-center justify-center mb-4 shadow-inner">
                    <Mail size={40} strokeWidth={1.2} className="text-stone-400" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-stone-400">Image de contact</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute inset-x-6 bottom-6 rounded-[1.8rem] border border-white/60 bg-white/80 p-6 backdrop-blur-xl shadow-[0_18px_40px_rgba(28,25,23,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-stone-400">Disponibilite</p>
                <p className="mt-2 font-display text-2xl leading-tight text-somacan-brand">
                  {overlayTitle}
                  <br />
                  {overlaySubtitle}
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-[#043920] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white">
                {overlayBadge}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
