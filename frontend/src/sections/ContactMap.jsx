import { motion } from 'framer-motion';

const revealUp = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

export default function ContactMap({
  eyebrow = 'Localisation',
  title = 'Retrouvez',
  titleItalic = 'Somacan a Casablanca.',
  description = "Notre univers est pense comme une experience plus qu'un simple point de contact. Utilisez la carte pour nous situer et organiser un echange, une visite ou un retrait selon votre besoin.",
  mapSrc = 'https://www.google.com/maps?q=Casablanca%2C%20Morocco&z=12&output=embed',
  mapTitle = 'Somacan Casablanca map',
}) {
  return (
    <section id="map" className="section-padding pt-24 pb-0 bg-[#fcfaf7]">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div {...revealUp}>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.38em] text-stone-400">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl leading-tight text-somacan-brand md:text-6xl">
            {title}
            <br />
            <span className="font-light italic text-stone-400">{titleItalic}</span>
          </h2>
          <p className="mt-8 max-w-xl text-[17px] font-light leading-8 text-stone-600">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="overflow-hidden rounded-[2.7rem] border border-stone-200 bg-white p-3 shadow-[0_24px_80px_rgba(28,25,23,0.06)]"
        >
          <iframe
            title={mapTitle}
            src={mapSrc}
            className="h-[280px] md:h-[400px] lg:h-[460px] w-full rounded-[2rem] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
