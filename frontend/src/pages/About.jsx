import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FlaskConical, Leaf, Sparkles, SunMedium } from 'lucide-react';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';

const aboutHero = resolveCmsAssetUrl('/asset/ChatGPT Image 29 avr. 2026, 15_06_48 (3).png');
const aboutDetail = resolveCmsAssetUrl('/asset/Soins de bien-être élégants et naturels.png');
const aboutPortrait = resolveCmsAssetUrl('/asset/ChatGPT Image 14 avr. 2026, 14_25_00.png');

const principles = [
  {
    icon: Leaf,
    title: 'Botanique situee',
    text: "Nous partons d'un territoire, d'un rythme et d'un geste avant de parler de produit. La matiere n'est jamais deconnectee de son univers.",
  },
  {
    icon: FlaskConical,
    title: 'Formules lisibles',
    text: "Somacan cherche des textures claires, sensorielles et immediates. Le luxe, ici, ne vient pas de l'exces mais de la precision.",
  },
  {
    icon: Sparkles,
    title: 'Rituel contemporain',
    text: "Chaque soin doit pouvoir entrer dans une vraie vie, avec une sensation juste, une application simple et une memoire durable.",
  },
];

const timeline = [
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

const commitments = [
  "Des soins penses comme des objets d'usage quotidien, pas comme des promesses abstraites.",
  "Une marque qui relie le visuel, le toucher et le langage au lieu de les traiter separement.",
  "Une attention particuliere aux textures, parce que l'experience commence avant tout resultat visible.",
  "Un univers calme, premium et marocain sans folklore excessif ni imitation des codes globaux les plus vus.",
];

const revealUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function About() {
  return (
    <main className="min-h-screen bg-[#fcfaf7] pb-24 pt-24">
      <section className="section-padding">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div {...revealUp}>
            <motion.p className="mb-6 text-[10px] font-bold uppercase tracking-[0.42em] text-stone-400">
              Notre Histoire
            </motion.p>
            <motion.h1 className="font-display text-5xl leading-[0.9] text-somacan-brand md:text-8xl">
              Un soin ne nait pas
              <br />
              <span className="font-light italic text-stone-400">d'une tendance.</span>
            </motion.h1>
            <motion.p className="mt-8 max-w-2xl text-lg font-light leading-8 text-stone-600">
              Somacan est ne d'une conviction simple: la beaute peut etre a la fois precise, sensorielle et profonde. Nous voulions une marque capable de parler du Maroc sans caricature, du soin sans agitation, et du luxe sans demonstration forcee.
            </motion.p>
            <motion.p className="mt-6 max-w-2xl text-[16px] font-light leading-8 text-stone-500">
              L'ambition n'etait pas de produire une ligne cosmetique de plus, mais de construire un langage complet autour du rituel: la matiere, le geste, l'image, le silence, la duree.
            </motion.p>

            <motion.div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-luxury btn-luxury-primary">
                Explorer la boutique
                <ArrowRight size={14} />
              </Link>
              <Link to="/blog" className="btn-luxury btn-luxury-outline">
                Lire le Journal
              </Link>
            </motion.div>

            <motion.div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-stone-200 pt-8">
              <div>
                <p className="font-display text-3xl text-somacan-brand">3</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.26em] text-stone-400">piliers</p>
              </div>
              <div>
                <p className="font-display text-3xl text-somacan-brand">1</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.26em] text-stone-400">vision claire</p>
              </div>
              <div>
                <p className="font-display text-3xl text-somacan-brand">∞</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.26em] text-stone-400">gestes possibles</p>
              </div>
            </motion.div>
          </motion.div>

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
              <motion.img
                src={aboutHero}
                alt="Univers Somacan"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-6 left-6 rounded-full border border-white/70 bg-white/90 px-6 py-4 backdrop-blur-sm shadow-[0_18px_40px_rgba(28,25,23,0.12)]"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-stone-400">Signature</p>
              <p className="mt-1 font-display text-2xl text-somacan-brand">Calme. Matiere. Precision.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          {principles.map((item, index) => (
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
                <item.icon className="mb-6 text-gold-500" size={22} strokeWidth={1.6} />
              </motion.div>
              <h2 className="mb-4 font-display text-3xl text-somacan-brand">{item.title}</h2>
              <p className="text-sm font-light leading-7 text-stone-500">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding pt-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.div {...revealUp}>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">
              Manifeste
            </p>
            <h2 className="font-display text-4xl leading-tight text-somacan-brand md:text-6xl">
              Nous croyons aux soins qui laissent une memoire, pas seulement une promesse.
            </h2>
          </motion.div>

          <motion.div {...revealUp} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }} className="space-y-7">
            <p className="text-[17px] font-light leading-8 text-stone-600">
              Pour nous, un produit d'exception n'est pas simplement une somme d'actifs. C'est une experience parfaitement composee. La facon dont il entre dans la routine. Le silence qu'il installe. Le type de relation qu'il cree avec la peau et avec le temps.
            </p>
            <p className="text-[17px] font-light leading-8 text-stone-600">
              C'est pour cela que Somacan travaille autant la formulation que l'atmosphere. Nous ne separons pas le fond et la forme. La beaute du flacon, la justesse des mots, la sensualite de la texture et la lisibilite du geste doivent raconter la meme chose.
            </p>
            <p className="text-[17px] font-light leading-8 text-stone-600">
              Cette coherence est notre exigence principale. Elle nous permet de construire une marque plus dense, plus calme et plus reconnaissable.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding pt-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <motion.div
            {...revealUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2.75rem] bg-stone-100"
          >
            <motion.img
              src={aboutDetail}
              alt="Rituel Somacan"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent" />
          </motion.div>

          <motion.div {...revealUp} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">
              Methode
            </p>
            <h2 className="font-display text-4xl leading-tight text-somacan-brand md:text-6xl">
              Traduire l'heritage en gestes contemporains.
            </h2>
            <p className="mt-8 text-[17px] font-light leading-8 text-stone-600">
              Somacan puise dans un imaginaire marocain reel: les matieres vegetales, l'importance du toucher, le lien entre soin et hospitalite, la sensualite discrete des textures et des parfums.
            </p>
            <p className="mt-6 text-[17px] font-light leading-8 text-stone-600">
              Mais nous refusons de figer cet heritage dans une image folklorique. Nous le faisons passer par une ecriture plus nette, plus minimaliste, plus actuelle. Ce n'est pas une nostalgie. C'est une traduction.
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
                Chaque formule doit pouvoir vivre dans une vraie routine: facile a adopter, belle a appliquer, suffisamment singuliere pour etre memorisee.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding pt-24">
        <motion.div
          {...revealUp}
          className="mx-auto overflow-hidden rounded-[2.75rem] bg-stone-900 px-8 py-14 text-stone-100 shadow-[0_30px_100px_rgba(28,25,23,0.18)] md:px-14 md:py-16"
        >
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.36em] text-stone-500">
                Construction
              </p>
              <h2 className="font-display text-4xl leading-tight text-white md:text-6xl">
                Comment une intuition devient une marque.
              </h2>
            </div>
            <p className="max-w-xl text-sm font-light leading-7 text-stone-300">
              Somacan s'est construit par reduction, pas par accumulation. Il a fallu observer, retirer, recomposer puis clarifier jusqu'a trouver une forme juste.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 lg:grid-cols-3">
            {timeline.map((item, index) => (
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

      <section className="section-padding pt-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            {...revealUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[2.5rem] shadow-[0_24px_80px_rgba(28,25,23,0.10)]"
          >
            <motion.img
              src={aboutPortrait}
              alt="Detail Somacan"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          <motion.div {...revealUp} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">
              Engagement
            </p>
            <h2 className="font-display text-4xl leading-tight text-somacan-brand md:text-6xl">
              Une marque qui prefere la coherence a la surenchere.
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
              <Link to="/shop" className="btn-luxury btn-luxury-primary">
                Voir les soins
                <ArrowRight size={14} />
              </Link>
              <Link to="/blog" className="btn-luxury btn-luxury-outline">
                Ouvrir le Journal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
