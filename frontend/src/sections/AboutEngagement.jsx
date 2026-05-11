import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Usage:
// <AboutEngagement engagementImage="/path/to/image.png" eyebrow="Engagement" title="..." commitments={[...]} ... />

const revealUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const defaultCommitments = [
  "Des soins penses comme des objets d'usage quotidien, pas comme des promesses abstraites.",
  "Une marque qui relie le visuel, le toucher et le langage au lieu de les traiter separement.",
  "Une attention particuliere aux textures, parce que l'experience commence avant tout resultat visible.",
  "Un univers calme, premium et marocain sans folklore excessif ni imitation des codes globaux les plus vus.",
];

export default function AboutEngagement({
  eyebrow = 'Engagement',
  title = 'Une marque qui prefere la coherence a la surenchere.',
  commitments = defaultCommitments,
  ctaPrimaryText = 'Voir les soins',
  ctaPrimaryHref = '/shop',
  ctaSecondaryText = 'Ouvrir le Journal',
  ctaSecondaryHref = '/blog',
  engagementImage = '',
}) {
  return (
    <section className="section-padding pt-24 bg-[#fcfaf7]">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* Left: image */}
        <motion.div
          {...revealUp}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[2.5rem] shadow-[0_24px_80px_rgba(28,25,23,0.10)]"
        >
          {engagementImage ? (
            <motion.img
              src={engagementImage}
              alt="Detail Somacan"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div className="h-[280px] md:h-[520px] w-full bg-stone-100" />
          )}
        </motion.div>

        {/* Right: text + commitments + CTAs */}
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

          <div className="mt-8 space-y-5">
            {commitments.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 6 }}
                className="flex gap-4 border-t border-stone-200 pt-5 first:border-t-0 first:pt-0"
              >
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gold-500" />
                <p className="text-[16px] font-light leading-8 text-stone-600">{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to={ctaPrimaryHref} className="btn-luxury btn-luxury-primary">
              {ctaPrimaryText}
              <ArrowRight size={14} />
            </Link>
            <Link to={ctaSecondaryHref} className="btn-luxury btn-luxury-outline">
              {ctaSecondaryText}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
