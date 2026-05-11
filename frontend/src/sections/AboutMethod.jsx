import { motion } from 'framer-motion';
import { SunMedium } from 'lucide-react';

// Usage:
// <AboutMethod methodImage="/path/to/image.png" eyebrow="Methode" title="..." ... />

const revealUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function AboutMethod({
  eyebrow = 'Methode',
  title = "Traduire l'heritage en gestes contemporains.",
  description1 = "Somacan puise dans un imaginaire marocain reel: les matieres vegetales, l'importance du toucher, le lien entre soin et hospitalite, la sensualite discrete des textures et des parfums.",
  description2 = "Mais nous refusons de figer cet heritage dans une image folklorique. Nous le faisons passer par une ecriture plus nette, plus minimaliste, plus actuelle. Ce n'est pas une nostalgie. C'est une traduction.",
  quoteText = "Chaque formule doit pouvoir vivre dans une vraie routine: facile a adopter, belle a appliquer, suffisamment singuliere pour etre memorisee.",
  methodImage = '',
}) {
  return (
    <section className="section-padding pt-24 bg-[#fcfaf7]">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        {/* Left: image */}
        <motion.div
          {...revealUp}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2.75rem] bg-stone-100"
        >
          {methodImage ? (
            <motion.img
              src={methodImage}
              alt="Rituel Somacan"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div className="h-[280px] md:h-[520px] w-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent" />
        </motion.div>

        {/* Right: text + quote card */}
        <motion.div
          {...revealUp}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl leading-tight text-somacan-brand md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-8 text-[17px] font-light leading-8 text-stone-600">
            {description1}
          </p>
          <p className="mt-6 text-[17px] font-light leading-8 text-stone-600">
            {description2}
          </p>

          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.35 }}
            className="mt-8 flex items-start gap-4 rounded-[1.5rem] border border-stone-200 bg-white/70 p-6"
          >
            <motion.div whileHover={{ rotate: -8, scale: 1.08 }} transition={{ duration: 0.35 }}>
              <SunMedium className="mt-1 shrink-0 text-gold-500" size={18} />
            </motion.div>
            <p className="text-sm font-light leading-7 text-stone-500">
              {quoteText}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
