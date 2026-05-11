import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { buildImageStyle, buildSectionLayoutStyle, buildTypographyStyle } from './sectionStyleUtils';

const heroBg      = new URL('../public/asset/slider 1 somacan.png', import.meta.url).href;
const productImg  = new URL('../public/asset/Huile_relaxante_Produit_-removebg-preview.png', import.meta.url).href;

const miniStats = [
  { value: '5K+',  label: 'Clientes' },
  { value: '100%', label: 'Naturel' },
  { value: '4.9★', label: 'Note' },
];

export default function Hero({ 
  title,
  subtitle,
  description,
  products: cmsProducts,
  settings = {},
  sectionMinHeight,
  contentMaxWidth,
  contentGap,
  columnsTemplate,
  alignItems,
  justifyContent,
  showMiniStats = true,
  showScrollIndicator = true,
  ...styleProps
}) {
  const { products: dbProducts, loading: dbLoading } = useProducts({ featured: true });
  
  const featuredProduct = cmsProducts && cmsProducts.length > 0 
    ? cmsProducts[0] 
    : dbProducts[0];
    
  const loading = !cmsProducts && dbLoading;
  const containerRef = useRef(null);
  const titleStyle = buildTypographyStyle(styleProps, 'title');
  const subtitleStyle = buildTypographyStyle(styleProps, 'subtitle');
  const descriptionStyle = buildTypographyStyle(styleProps, 'description');
  const heroImageStyle = buildImageStyle(styleProps, 'heroImage');
  const productImageStyle = buildImageStyle(styleProps, 'productImage');
  const backgroundType = settings.backgroundType || 'image';
  const backgroundColor = settings.backgroundColor || '#fcfaf7';
  const backgroundGradient = settings.backgroundGradient || 'linear-gradient(135deg, #fcfaf7 0%, #f3eee4 100%)';
  const backgroundImage = settings.backgroundImage || heroBg;
  const backgroundImageFit = settings.backgroundImageFit || 'cover';
  const backgroundImagePosition = settings.backgroundImagePosition || 'center center';
  const backgroundImageOpacity = settings.backgroundImageOpacity || '0.6';
  const layoutStyle = buildSectionLayoutStyle({
    minHeight: sectionMinHeight,
    contentMaxWidth,
    contentGap,
    alignItems,
    justifyContent,
    columnsTemplate,
  });

  useGSAP(() => {
    if (loading || !featuredProduct) return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.h-label',       { y: 16, opacity: 0, duration: 1,   delay: 0.3 })
      .from('.h-line',        { scaleX: 0, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.h-title-row',   { y: 60, opacity: 0, duration: 1.4, stagger: 0.12 }, '-=0.5')
      .from('.h-desc',        { y: 20, opacity: 0, duration: 1 },   '-=1')
      .from('.h-cta',         { y: 16, opacity: 0, duration: 0.9 }, '-=0.8')
      .from('.h-stats',       { y: 12, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.h-product',     { x: 40, opacity: 0, duration: 1.8 }, '-=1.6')
      .from('.h-ring',        { scale: 0.6, opacity: 0, duration: 2 }, '-=1.8');

  }, { scope: containerRef, dependencies: [loading, featuredProduct] });

  if (loading || !featuredProduct) return (
    <div className="h-[92vh] bg-[#fcfaf7] flex items-center justify-center">
      <div className="w-10 h-10 border-t-2 border-stone-300 rounded-full animate-spin" />
    </div>
  );

  return (
    <section
      ref={containerRef}
      className="relative flex items-center overflow-hidden"
      style={{
        height: 'clamp(680px, 92vh, 960px)',
        minHeight: sectionMinHeight || settings.minHeight || undefined,
        backgroundColor: backgroundType === 'solid' ? backgroundColor : undefined,
        backgroundImage: backgroundType === 'gradient' ? backgroundGradient : undefined,
      }}
    >
      <div className="absolute inset-0 z-0">
        {backgroundType === 'image' && (
          <>
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full"
              style={{
                objectFit: backgroundImageFit,
                objectPosition: backgroundImagePosition,
                opacity: backgroundImageOpacity,
                ...heroImageStyle,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcfaf7] via-[#fcfaf7]/75 to-[#fcfaf7]/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf7]/50 to-transparent" />
          </>
        )}
        {backgroundType === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf7]/25 to-transparent" />
        )}
        {backgroundType === 'solid' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
        )}
      </div>

      {/* Layout */}
      <div className="section-padding w-full pt-28 pb-16 relative z-10">
        <div
          className="grid w-full lg:grid-cols-[5fr_6fr] gap-12 xl:gap-20 items-center"
          style={layoutStyle}
        >

          {/* ── Left: text ── */}
          <div>
            {/* Label row */}
            <div className="flex items-center gap-4 mb-8">
              <span className="h-label text-[9px] font-bold uppercase tracking-[0.5em] text-stone-400">
                Collection Signature
              </span>
              <span className="h-line block flex-1 max-w-[48px] h-px bg-gold-400 origin-left" />
            </div>

            {/* Title */}
            <h1 
              className="hero-title font-display text-7xl md:text-9xl leading-[0.85] mb-10 overflow-hidden"
              style={titleStyle}
            >
              <span 
                className="h-title-row block italic font-light text-stone-400 mb-2"
                style={subtitleStyle}
              >
                {subtitle || "L'essence de la"}
              </span>
              <span className="h-title-row block">{title || "Pureté."}</span>
            </h1>

            {/* Description */}
            <p className="h-desc text-[15px] text-stone-500 font-light leading-relaxed mb-10 max-w-[340px]" style={descriptionStyle}>
              {description || "Une alchimie précieuse entre rituels ancestraux marocains et science moderne. Des soins d'exception pour une peau véritablement transformée."}
            </p>

            {/* CTAs */}
            <div className="h-cta flex items-center gap-8">
              <Link
                to={`/shop/${featuredProduct.slug}`}
                className="btn-luxury btn-luxury-primary"
              >
                Découvrir le soin
                <ArrowRight size={13} />
              </Link>
              <Link
                to="/shop"
                className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-2"
              >
                Voir la collection
              </Link>
            </div>

            {/* Mini stats */}
            {showMiniStats && (
            <div className="h-stats flex items-center gap-8 mt-12 pt-10 border-t border-stone-200">
              {miniStats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-xl text-gold-500 leading-none mb-1">{s.value}</p>
                  <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-stone-400">{s.label}</p>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* ── Right: product ── */}
          <div className="relative flex items-center justify-center">
            {/* Warm decorative ring */}
            <div className="h-ring absolute w-[420px] h-[420px] xl:w-[500px] xl:h-[500px] rounded-full bg-gradient-to-br from-gold-50 via-stone-100/60 to-transparent" />

            {/* Second subtle ring */}
            <div className="h-ring absolute w-[320px] h-[320px] xl:w-[380px] xl:h-[380px] rounded-full border border-stone-200/60" />

            {/* Product float */}
            <motion.div
              className="h-product relative z-10"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img
                src={productImg}
                alt={featuredProduct.name}
                className="w-72 md:w-80 xl:w-96 object-contain drop-shadow-[0_32px_80px_rgba(28,25,23,0.13)]"
                style={productImageStyle}
              />
            </motion.div>

            {/* Product name tag — bottom right */}
            <div className="absolute bottom-0 right-0 md:right-4 glass-card px-5 py-4 rounded-2xl z-20">
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-1">
                {featuredProduct.category || 'Soin Signature'}
              </p>
              <p 
                className={`font-display ${featuredProduct.nameSize && !featuredProduct.nameSize.includes('px') ? `text-${featuredProduct.nameSize}` : 'text-base'} text-somacan-brand leading-tight max-w-[160px]`}
                style={{ 
                  color: featuredProduct.nameColor || undefined,
                  fontSize: featuredProduct.nameSize && featuredProduct.nameSize.includes('px') ? featuredProduct.nameSize : undefined
                }}
              >
                {featuredProduct.name}
              </p>
              <p 
                className={`font-bold ${featuredProduct.priceSize && !featuredProduct.priceSize.includes('px') ? `text-${featuredProduct.priceSize}` : 'text-[11px]'} mt-1`}
                style={{ 
                  color: featuredProduct.priceColor || '#B87D22',
                  fontSize: featuredProduct.priceSize && featuredProduct.priceSize.includes('px') ? featuredProduct.priceSize : undefined
                }}
              >
                {featuredProduct.price} MAD
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-25">
        <div className="w-px h-10 bg-stone-600 animate-pulse" />
        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-stone-500">Scroll</span>
      </div>
      )}
    </section>
  );
}
