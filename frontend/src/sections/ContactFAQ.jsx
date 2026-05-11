import { motion } from 'framer-motion';

const revealUp = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const DEFAULT_FAQS = [
  {
    title: 'Je ne sais pas quel produit choisir.',
    text: "Dites-nous votre besoin, votre type de peau et votre routine actuelle. Nous vous orienterons vers une selection claire, sans surcharge.",
  },
  {
    title: 'Puis-je prendre rendez-vous ?',
    text: "Oui. Pour les demandes premium, presse ou partenariats, nous pouvons organiser un echange prive en visio ou a Casablanca.",
  },
  {
    title: 'Le formulaire envoie-t-il un vrai message ?',
    text: "Le formulaire est connecte a notre backend. Il valide les champs, enregistre la soumission et affiche une confirmation. Chaque message est lu par notre equipe.",
  },
];

export default function ContactFAQ({
  eyebrow = 'Questions frequentes',
  title = 'Avant de nous ecrire.',
  subtitle = "Quelques clarifications utiles pour garder l'echange fluide et rapide.",
  faqs = DEFAULT_FAQS,
}) {
  return (
    <section className="section-padding pt-24 pb-24 bg-[#fcfaf7]">
      <motion.div
        {...revealUp}
        className="mx-auto max-w-7xl rounded-[2rem] md:rounded-[2.8rem] bg-stone-900 px-5 py-8 text-stone-100 shadow-[0_24px_80px_rgba(28,25,23,0.16)] md:px-12 md:py-14"
      >
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-stone-500">{eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">{title}</h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-stone-400">{subtitle}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6"
            >
              <h3 className="font-display text-2xl text-white">{item.title}</h3>
              <p className="mt-4 text-sm font-light leading-7 text-stone-300">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
