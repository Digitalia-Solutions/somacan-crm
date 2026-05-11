import { motion } from 'framer-motion';
import { Leaf, FlaskConical, Sparkles } from 'lucide-react';

// Usage:
// <AboutPrinciples principles={[{ icon: 'Leaf', title: '...', text: '...' }]} />

const ICON_MAP = { Leaf, FlaskConical, Sparkles };

const defaultPrinciples = [
  {
    icon: 'Leaf',
    title: 'Botanique situee',
    text: "Nous partons d'un territoire, d'un rythme et d'un geste avant de parler de produit. La matiere n'est jamais deconnectee de son univers.",
  },
  {
    icon: 'FlaskConical',
    title: 'Formules lisibles',
    text: "Somacan cherche des textures claires, sensorielles et immediates. Le luxe, ici, ne vient pas de l'exces mais de la precision.",
  },
  {
    icon: 'Sparkles',
    title: 'Rituel contemporain',
    text: "Chaque soin doit pouvoir entrer dans une vraie vie, avec une sensation juste, une application simple et une memoire durable.",
  },
];

export default function AboutPrinciples({ principles = defaultPrinciples }) {
  return (
    <section className="section-padding pt-24 bg-[#fcfaf7]">
      <div className="mx-auto grid max-w-7xl gap-6 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((item, index) => {
          const IconComponent = ICON_MAP[item.icon] || Leaf;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="rounded-[2rem] border border-stone-200/70 bg-white/80 p-10 shadow-[0_18px_60px_rgba(28,25,23,0.05)] backdrop-blur-sm"
            >
              <motion.div whileHover={{ rotate: -6, scale: 1.08 }} transition={{ duration: 0.35 }}>
                <IconComponent className="mb-6 text-gold-500" size={22} strokeWidth={1.6} />
              </motion.div>
              <h2 className="mb-4 font-display text-3xl text-somacan-brand">{item.title}</h2>
              <p className="text-sm font-light leading-7 text-stone-500">{item.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
