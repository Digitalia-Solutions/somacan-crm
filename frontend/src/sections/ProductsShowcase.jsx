import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ui/ProductCard';
import { buildSectionLayoutStyle, buildTypographyStyle } from './sectionStyleUtils';

gsap.registerPlugin(ScrollTrigger);

export default function ProductsShowcase({
  eyebrow,
  title,
  subtitle,
  ctaText,
  ctaLink,
  maxItems,
  trackGap,
  cardWidth,
  sectionMinHeight,
  contentMaxWidth,
  contentGap,
  columnsTemplate,
  alignItems,
  justifyContent,
  ...styleProps
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const { products, loading } = useProducts({ featured: true });
  const titleStyle = buildTypographyStyle(styleProps, 'title');
  const subtitleStyle = buildTypographyStyle(styleProps, 'subtitle');
  const layoutStyle = buildSectionLayoutStyle({
    minHeight: sectionMinHeight,
    contentMaxWidth,
    contentGap,
    columnsTemplate,
    alignItems,
    justifyContent,
  });
  const visibleProducts = Number(maxItems) > 0 ? products.slice(0, Number(maxItems)) : products;

  useGSAP(() => {
    if (loading || products.length === 0) return;

    gsap.from('.showcase-header', {
      y: 25,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
      }
    });

    gsap.from('.product-track-item', {
      x: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trackRef.current,
        start: 'top 85%',
      }
    });
  }, { scope: containerRef, dependencies: [loading, products.length] });

  return (
    <section ref={containerRef} className="py-24 bg-[#fcfaf7] overflow-hidden" style={{ minHeight: sectionMinHeight || undefined }}>
      <div className="section-padding" style={layoutStyle}>
        <header className="showcase-header flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-stone-300" />
              {eyebrow || 'Sélection Exclusive'}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-somacan-brand leading-tight" style={titleStyle}>
              {title || "Les Essentiels"} <br />
              <span className="italic font-light text-gold-500" style={subtitleStyle}>{subtitle || "du moment."}</span>
            </h2>
          </div>
          <Link
            to={ctaLink || '/shop'}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-900 border-b border-stone-200 pb-2 hover:border-stone-900 transition-all flex items-center gap-3 self-start md:self-auto whitespace-nowrap"
          >
            {ctaText || 'Voir tous les produits'} <ArrowRight size={14} strokeWidth={1} />
          </Link>
        </header>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto pb-4 px-6 md:px-12 lg:px-24 xl:px-40 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', gap: trackGap || '1.5rem' }}
      >
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="shrink-0 w-64 md:w-72 space-y-6 opacity-20 snap-start">
                <div className="aspect-[4/5] bg-stone-200 rounded-3xl animate-pulse" />
                <div className="h-4 w-1/3 bg-stone-200 mx-auto animate-pulse" />
                <div className="h-5 w-2/3 bg-stone-200 mx-auto animate-pulse" />
              </div>
            ))
          : visibleProducts.map((product) => (
              <div
                key={product.id || product._id}
                className="product-track-item shrink-0 w-64 md:w-72 snap-start"
                style={{ width: cardWidth || '18rem' }}
              >
                <ProductCard product={product} variant="showcase" className="w-full" />
              </div>
            ))}
      </div>
    </section>
  );
}
