import { motion } from 'framer-motion';

// Usage:
// <AboutManifeste eyebrow="Manifeste" title="Nous croyons..." paragraph1="..." paragraph2="..." paragraph3="..." />

const revealUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function AboutManifeste({
  eyebrow = 'Manifeste',
  title = 'Nous croyons aux soins qui laissent une memoire, pas seulement une promesse.',
  paragraph1 = "Pour nous, un produit d'exception n'est pas simplement une somme d'actifs. C'est une experience parfaitement composee. La facon dont il entre dans la routine. Le silence qu'il installe. Le type de relation qu'il cree avec la peau et avec le temps.",
  paragraph2 = "C'est pour cela que Somacan travaille autant la formulation que l'atmosphere. Nous ne separons pas le fond et la forme. La beaute du flacon, la justesse des mots, la sensualite de la texture et la lisibilite du geste doivent raconter la meme chose.",
  paragraph3 = "Cette coherence est notre exigence principale. Elle nous permet de construire une marque plus dense, plus calme et plus reconnaissable.",
}) {
  return (
    <section className="section-padding pt-24 bg-[#fcfaf7]">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        {/* Left: eyebrow + h2 */}
        <motion.div {...revealUp}>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl leading-tight text-somacan-brand md:text-5xl lg:text-6xl">
            {title}
          </h2>
        </motion.div>

        {/* Right: 3 paragraphs */}
        <motion.div
          {...revealUp}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="space-y-7"
        >
          <p className="text-[17px] font-light leading-8 text-stone-600">{paragraph1}</p>
          <p className="text-[17px] font-light leading-8 text-stone-600">{paragraph2}</p>
          <p className="text-[17px] font-light leading-8 text-stone-600">{paragraph3}</p>
        </motion.div>
      </div>
    </section>
  );
}
