import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * ShopHero — Immersive hero header for the Shop page.
 *
 * Usage:
 *   <ShopHero />
 *   <ShopHero
 *     eyebrow="L'Art du Soin"
 *     title="Boutique"
 *     titleItalic="Holistique."
 *     description="Explorez une collection..."
 *     heroImage="/path/to/image.jpg"
 *   />
 */
export default function ShopHero({
  eyebrow = "L'Art du Soin",
  title = "Boutique",
  titleItalic = "Holistique.",
  description = "Explorez une collection de soins botaniques d'exception, où chaque flacon renferme l'âme des rituels marocains et la pureté du CBD.",
  heroImage = "",
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
    tl.from('.shop-hero-bg', { scale: 1.1, opacity: 0, duration: 2 })
      .from('.shop-header-item', { y: 40, opacity: 0, stagger: 0.1 }, "-=1.5");
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center overflow-hidden">
      {/* Background image with overlay gradient */}
      <div className="absolute inset-0 z-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt="Boutique Hero"
            className="shop-hero-bg w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="shop-hero-bg w-full h-full bg-stone-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcfaf7] via-[#fcfaf7]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf7]/60 to-transparent md:hidden" />
      </div>

      {/* Content */}
      <div className="section-padding max-w-[90rem] mx-auto relative z-10 w-full">
        <div className="max-w-3xl">
          <p className="shop-header-item text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 mb-5 md:mb-8 flex items-center gap-4">
            <span className="w-8 md:w-12 h-px bg-stone-300" />
            {eyebrow}
          </p>
          <h1 className="shop-header-item font-display leading-[0.9] mb-5 md:mb-8" style={{ fontSize: 'clamp(2.25rem, 8vw, 7rem)', color: '#043920' }}>
            {title}<br />
            <span className="italic font-light text-stone-400">{titleItalic}</span>
          </h1>
          <p className="shop-header-item text-sm text-stone-600 font-light max-w-md leading-relaxed hidden sm:block">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
