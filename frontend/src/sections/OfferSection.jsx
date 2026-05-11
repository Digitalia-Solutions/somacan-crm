import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';
import { buildImageStyle, buildSectionLayoutStyle, buildTypographyStyle } from './sectionStyleUtils';

export default function OfferSection({
  eyebrow,
  title,
  subtitle,
  description,
  image,
  imageAlt,
  buttonText,
  buttonLink,
  badgeText,
  sectionMinHeight,
  contentMaxWidth,
  contentGap,
  columnsTemplate,
  alignItems,
  justifyContent,
  ...styleProps
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const titleStyle = buildTypographyStyle(styleProps, 'title');
  const subtitleStyle = buildTypographyStyle(styleProps, 'subtitle');
  const descriptionStyle = buildTypographyStyle(styleProps, 'description');
  const imageStyle = buildImageStyle(styleProps, 'image');
  const layoutStyle = buildSectionLayoutStyle({
    minHeight: sectionMinHeight,
    contentMaxWidth,
    contentGap,
    columnsTemplate,
    alignItems,
    justifyContent,
  });

  return (
    <section ref={containerRef} className="py-24 bg-[#fcfaf7] overflow-hidden relative" style={{ minHeight: sectionMinHeight || undefined }}>
      <div className="section-padding w-full" style={layoutStyle}>
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-40 items-center" style={layoutStyle}>
          
          <div className="relative group">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <motion.img
                src={resolveCmsAssetUrl(image) || resolveCmsAssetUrl('/asset/ChatGPT Image 29 avr. 2026, 12_21_25.png')}
                alt={imageAlt || 'Rituel Somacan'}
                className="w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ y: imgY, ...imageStyle }}
              />
              <div className="absolute inset-0 bg-stone-900/5 mix-blend-multiply" />
            </div>

            {/* Spinning circle badge */}
            <div className="absolute -top-8 -left-8 z-20 w-40 h-40">
              <div className="absolute inset-0 rounded-full glass-card shadow-2xl" />
              <svg
                viewBox="0 0 150 150"
                className="absolute inset-0 w-full h-full animate-spin-slow"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="offer-circle-path"
                    d="M 75,75 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                  />
                </defs>
                <text fontSize="8.5" fontWeight="700" letterSpacing="2.5" fill="#78716c" fontFamily="Manrope, sans-serif">
                  <textPath href="#offer-circle-path">
                    {badgeText || 'EXCLUSIVITÉ · PRIVILÈGE · MEMBRES SOMACAN ·'}
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-gold-500 text-2xl select-none">✦</span>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <header>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-8 flex items-center gap-4">
                <span className="w-8 h-px bg-stone-200" />
                {eyebrow || 'Offre Exceptionnelle'}
              </p>
              
              <h2 className="font-display text-5xl md:text-8xl text-somacan-brand leading-tight" style={titleStyle}>
                {title || "L’Éclat d'un"} <br />
                <span className="italic text-stone-400 font-light" style={subtitleStyle}>{subtitle || "Rituel Rare."}</span>
              </h2>
            </header>

            <p className="text-xl text-stone-500 font-light leading-relaxed max-w-md" style={descriptionStyle}>
              {description || "Plus qu'un simple soin, une invitation au voyage intérieur. Profitez de notre rituel corps signature, une édition limitée conçue pour l'apaisement absolu."}
            </p>

            <div className="pt-6">
              <Link to={buttonLink || '/shop'} className="btn-luxury btn-luxury-primary w-fit">
                {buttonText || "Rejoindre le cercle"}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
