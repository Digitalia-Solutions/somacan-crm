/**
 * ArticleEditorialNote — CMS-injectable editorial sidebar card.
 * Renders as a full-width section below article content.
 *
 * Usage:
 *   <ArticleEditorialNote
 *     eyebrow="Note éditoriale"
 *     description="Chaque article du Journal Somacan prolonge l'univers de la marque: botanique marocaine, précision cosmétique et rituels contemporains."
 *     ctaText="Découvrir Notre Histoire"
 *     ctaHref="/about"
 *   />
 */

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ArticleEditorialNote({
  eyebrow = 'Note éditoriale',
  description = "Chaque article du Journal Somacan prolonge l'univers de la marque: botanique marocaine, précision cosmétique et rituels contemporains.",
  ctaText = 'Découvrir Notre Histoire',
  ctaHref = '/about',
}) {
  return (
    <section className="section-padding pt-16 pb-24 bg-[#fcfaf7]">
      <div className="mx-auto max-w-5xl">
        <div className="h-fit rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-stone-400">
            {eyebrow}
          </p>
          <p className="mb-6 text-sm font-light leading-7 text-stone-500">
            {description}
          </p>
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-3 border-b border-stone-300 pb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 transition-colors hover:border-stone-900"
          >
            {ctaText}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
