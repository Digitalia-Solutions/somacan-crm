import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Leaf, FlaskConical, Sparkles, ShieldCheck } from 'lucide-react';

const items = [
  {
    num: '01',
    icon: Leaf,
    title: 'Héritage Botanique',
    desc: 'Des ingrédients rares sourcés au cœur du Maroc, sélectionnés pour leur pureté absolue et leur efficacité prouvée.',
  },
  {
    num: '02',
    icon: FlaskConical,
    title: 'Science Pure',
    desc: 'Extraction de pointe garantissant une concentration maximale des actifs et une stabilité parfaite de chaque formule.',
  },
  {
    num: '03',
    icon: Sparkles,
    title: 'Éveil Sensoriel',
    desc: 'Des textures soyeuses pensées pour une absorption instantanée et une expérience sensorielle unique à chaque application.',
  },
  {
    num: '04',
    icon: ShieldCheck,
    title: 'Soin Conscient',
    desc: 'Un engagement éthique total — cruelty-free, vegan, certifié halal — pour une beauté respectueuse et responsable.',
  },
];

const ICONS = {
  leaf: Leaf,
  flask: FlaskConical,
  flaskconical: FlaskConical,
  sparkles: Sparkles,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
};

export default function ExpertiseSection({
  eyebrow,
  title,
  subtitle,
  intro,
  items: cmsItems,
  itemGap,
  itemPadding,
  introMaxWidth,
  numberColor,
  titleColor,
  textColor,
}) {
  const currentItems = cmsItems && cmsItems.length > 0 ? cmsItems : items;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="notre-philosophie" ref={ref} className="py-24 bg-stone-900 text-stone-100 overflow-hidden">
      <div className="section-padding max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 mb-5">{eyebrow || 'Notre Philosophie'}</p>
            <h2 className="font-display text-4xl md:text-6xl leading-tight text-white">
              {title || "L'excellence du soin,"} <br />
              <span className="italic text-gold-400 font-light">{subtitle || 'sans compromis.'}</span>
            </h2>
          </div>
          <p className="text-sm text-stone-300/85 font-light leading-relaxed" style={{ maxWidth: introMaxWidth || '20rem' }}>
            {intro || 'Chaque pilier de notre méthode est guidé par une seule obsession : vous offrir le meilleur de la nature.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-stone-800">
          {currentItems.map((item, i) => {
            const IconComp = item.icon && typeof item.icon === 'function'
              ? item.icon
              : ICONS[String(item.icon || '').toLowerCase()] || Sparkles;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-stone-900 flex hover:bg-stone-800/60 transition-colors duration-500 overflow-hidden"
                style={{ gap: itemGap || '2rem', padding: itemPadding || '2.5rem' }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 blur-[40px] rounded-full translate-x-6 -translate-y-6 group-hover:bg-gold-400/10 transition-colors duration-700" />

                <div className="shrink-0">
                  <span className="font-display text-5xl group-hover:text-gold-500/30 transition-colors duration-700 leading-none select-none" style={{ color: numberColor || '#292524' }}>
                    {item.num || `0${i+1}`}
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComp className="text-gold-500 shrink-0" size={18} strokeWidth={1.5} />
                    <h3 className="font-display text-xl group-hover:text-gold-100 transition-colors duration-500" style={{ color: titleColor || '#ffffff' }}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[14px] leading-relaxed font-light group-hover:text-stone-300 transition-colors duration-500" style={{ color: textColor || '#a8a29e' }}>
                    {item.desc || item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
