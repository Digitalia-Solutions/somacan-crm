import { motion } from 'framer-motion';

// Usage:
// <AboutTimeline eyebrow="Construction" sectionTitle="Comment une intuition..." description="..." steps={[...]} />

const revealUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const defaultSteps = [
  {
    step: '01',
    title: 'Observer les rituels',
    text: "Comprendre les gestes transmis, les matieres qui apaisent et les formes de soin qui appartiennent deja a la culture marocaine.",
  },
  {
    step: '02',
    title: "Retenir l'essentiel",
    text: "Faire le tri. Garder la noblesse, la sensualite, la coherence. Retirer le decoratif et tout ce qui surcharge inutilement l'experience.",
  },
  {
    step: '03',
    title: 'Composer une marque',
    text: "Transformer cette matiere en une ecriture complete: formules, images, mots, rythme de routine et sensation d'ensemble.",
  },
];

export default function AboutTimeline({
  eyebrow = 'Construction',
  sectionTitle = 'Comment une intuition devient une marque.',
  description = "Somacan s'est construit par reduction, pas par accumulation. Il a fallu observer, retirer, recomposer puis clarifier jusqu'a trouver une forme juste.",
  steps = defaultSteps,
}) {
  return (
    <section className="section-padding pt-24 bg-[#fcfaf7]">
      <motion.div
        {...revealUp}
        className="mx-auto overflow-hidden rounded-[2rem] md:rounded-[2.75rem] bg-stone-900 px-5 py-10 text-stone-100 shadow-[0_30px_100px_rgba(28,25,23,0.18)] md:px-14 md:py-16"
      >
        {/* Header */}
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.36em] text-stone-500">
              {eyebrow}
            </p>
            <h2 className="font-display text-3xl leading-tight text-white md:text-5xl lg:text-6xl">
              {sectionTitle}
            </h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-stone-300">
            {description}
          </p>
        </div>

        {/* Steps grid — gap-px with bg-white/10 creates dividing lines */}
        <div className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ backgroundColor: 'rgba(38, 34, 31, 1)' }}
              className="bg-stone-900 p-8 transition-colors duration-300"
            >
              <p className="mb-4 font-display text-5xl leading-none text-stone-700">{item.step}</p>
              <h3 className="mb-4 font-display text-3xl text-white">{item.title}</h3>
              <p className="text-sm font-light leading-7 text-stone-300">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
