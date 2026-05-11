import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Usage:
// <AboutHero heroImage="/path/to/image.png" eyebrow="Notre Histoire" ... />

const revealUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function AboutHero({
  eyebrow = 'Notre Histoire',
  title = 'Un soin ne nait pas',
  titleItalic = "d'une tendance.",
  description1 = "Somacan est ne d'une conviction simple: la beaute peut etre a la fois precise, sensorielle et profonde. Nous voulions une marque capable de parler du Maroc sans caricature, du soin sans agitation, et du luxe sans demonstration forcee.",
  description2 = "L'ambition n'etait pas de produire une ligne cosmetique de plus, mais de construire un langage complet autour du rituel: la matiere, le geste, l'image, le silence, la duree.",
  ctaPrimaryText = 'Explorer la boutique',
  ctaPrimaryHref = '/shop',
  ctaSecondaryText = 'Lire le Journal',
  ctaSecondaryHref = '/blog',
  stat1Value = '3',
  stat1Label = 'piliers',
  stat2Value = '1',
  stat2Label = 'vision claire',
  stat3Value = '∞',
  stat3Label = 'gestes possibles',
  heroImage = '',
  badgeLabel = 'Signature',
  badgeText = 'Calme. Matiere. Precision.',
}) {
  return (
    <section className="section-padding pt-24 bg-[#fcfaf7]">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {/* Left column */}
        <motion.div {...revealUp}>
          <motion.p className="mb-6 text-[10px] font-bold uppercase tracking-[0.42em] text-stone-400">
            {eyebrow}
          </motion.p>
          <motion.h1 className="font-display text-4xl leading-[0.9] text-somacan-brand md:text-6xl lg:text-8xl">
            {title}
            <br />
            <span className="font-light italic text-stone-400">{titleItalic}</span>
          </motion.h1>
          <motion.p className="mt-8 max-w-2xl text-lg font-light leading-8 text-stone-600">
            {description1}
          </motion.p>
          <motion.p className="mt-6 max-w-2xl text-[16px] font-light leading-8 text-stone-500">
            {description2}
          </motion.p>

          <motion.div className="mt-10 flex flex-wrap gap-4">
            <Link to={ctaPrimaryHref} className="btn-luxury btn-luxury-primary">
              {ctaPrimaryText}
              <ArrowRight size={14} />
            </Link>
            <Link to={ctaSecondaryHref} className="btn-luxury btn-luxury-outline">
              {ctaSecondaryText}
            </Link>
          </motion.div>

          <motion.div className="mt-12 grid grid-cols-3 gap-2 md:gap-4 border-t border-stone-200 pt-8">
            <div>
              <p className="font-display text-3xl text-somacan-brand">{stat1Value}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.26em] text-stone-400">{stat1Label}</p>
            </div>
            <div>
              <p className="font-display text-3xl text-somacan-brand">{stat2Value}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.26em] text-stone-400">{stat2Label}</p>
            </div>
            <div>
              <p className="font-display text-3xl text-somacan-brand">{stat3Value}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.26em] text-stone-400">{stat3Label}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right column — image + floating badge */}
        <motion.div
          {...revealUp}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[2.75rem] shadow-[0_30px_100px_rgba(28,25,23,0.14)]"
          >
            {heroImage ? (
              <motion.img
                src={heroImage}
                alt="Univers Somacan"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : (
              <div className="h-[520px] w-full rounded-[2.75rem] bg-stone-100" />
            )}
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-6 left-6 rounded-full border border-white/70 bg-white/90 px-6 py-4 backdrop-blur-sm shadow-[0_18px_40px_rgba(28,25,23,0.12)]"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-stone-400">{badgeLabel}</p>
            <p className="mt-1 font-display text-2xl text-somacan-brand">{badgeText}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
