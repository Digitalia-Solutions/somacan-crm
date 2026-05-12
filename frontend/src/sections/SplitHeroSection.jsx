import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';

const imgVisage = new URL('../public/asset/ChatGPT Image 29 avr. 2026, 12_21_25.png', import.meta.url).href;
const imgCorps  = new URL('../public/asset/ChatGPT Image 14 avr. 2026, 21_04_48.png', import.meta.url).href;

const cards = [
  {
    image: imgVisage,
    tag: 'Collection Visage',
    title: 'Éclat\n& Pureté',
    desc: 'Des soins raffinés formulés à l\'essence du Maroc pour une peau lumineuse.',
    cta: 'Découvrir',
    slug: '/shop',
  },
  {
    image: imgCorps,
    tag: 'Collection Corps',
    title: 'Douceur\nAbsolue',
    desc: 'Rituels corps d\'exception pour une peau nourrie, soyeuse et visiblement transformée.',
    cta: 'Explorer',
    slug: '/shop',
  },
];

export default function SplitHeroSection({ items, sectionHeight, cardMinHeight, ctaAlwaysVisible = false }) {
  const currentCards = items && items.length > 0 ? items : cards;
  return (
    <section className="w-full flex flex-col md:flex-row" style={{ height: sectionHeight || 'clamp(520px, 85vh, 900px)' }}>
      {currentCards.map((card, i) => (
        <div key={i} className="relative flex-1 overflow-hidden group min-h-[50%] md:min-h-0" style={{ minHeight: cardMinHeight || undefined }}>

          {/* Background image — zooms on hover */}
          <img
            src={resolveCmsAssetUrl(card.image)}
            alt={card.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07]"
          />

          {/* Gradient overlay — darkens on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-stone-900/10 transition-colors duration-700 group-hover:from-stone-950/92 group-hover:via-stone-900/45" />

          {/* Thin vertical divider between cards (desktop) */}
          {i === 0 && (
            <div className="hidden md:block absolute right-0 top-[15%] bottom-[15%] w-px bg-white/10 z-10" />
          )}

          {/* Content block */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 px-10 text-center">

            {/* Label */}
            <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-stone-400 mb-5 transition-transform duration-700 ease-out group-hover:-translate-y-2">
              {card.tag || card.label}
            </p>

            {/* Title */}
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-5 whitespace-pre-line transition-transform duration-700 ease-out group-hover:-translate-y-2">
              {card.title}
            </h2>

            {/* Description */}
            <p className="text-[13px] text-stone-300 font-light max-w-[260px] leading-relaxed mb-8 transition-transform duration-700 ease-out group-hover:-translate-y-2">
              {card.description || card.desc}
            </p>

            {/* CTA — hidden by default, slides up on hover */}
            <Link
              to={card.slug}
              className="flex items-center gap-3 px-8 py-3.5 bg-white text-stone-900 text-[9px] font-bold uppercase tracking-[0.35em] rounded-full
                         translate-y-5
                         transition-all duration-700 ease-out
                         group-hover:opacity-100 group-hover:translate-y-0
                         hover:bg-stone-100 hover:shadow-lg"
              style={{ opacity: ctaAlwaysVisible ? 1 : 0, transform: ctaAlwaysVisible ? 'translateY(0)' : undefined }}
            >
              {card.cta}
              <ArrowRight size={12} strokeWidth={2} />
            </Link>

          </div>
        </div>
      ))}
    </section>
  );
}
