import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resolveCmsAssetUrl } from '../lib/cmsAssetUrl';

gsap.registerPlugin(ScrollTrigger);

const defaultImage = new URL('../public/asset/ChatGPT Image 14 avr. 2026, 14_25_00.png', import.meta.url).href;

export default function StorySection({
  eyebrow = "L'Héritage",
  title = "Un équilibre entre tradition & innovation.",
  paragraph1 = "Somacan est né d'une volonté simple : réconcilier les rituels de beauté ancestraux avec les découvertes scientifiques les plus modernes.",
  paragraph2 = "Chaque flacon renferme une alchimie précieuse. Nous sélectionnons des actifs naturels sourcés localement pour créer des soins qui apaisent l'esprit tout autant que la peau.",
  image,
  badgeText = "Élégance & Pureté",
  statValue = "5000+",
  statLabel = "Clients satisfaits",
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const imageSrc = image ? resolveCmsAssetUrl(image) : defaultImage;

  useGSAP(() => {
    // Parallax sur l'image
    gsap.to(imgRef.current, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Reveal progressif des éléments texte
    gsap.fromTo(
      containerRef.current.querySelectorAll('.story-reveal'),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    );

    // Reveal image
    gsap.fromTo(
      containerRef.current.querySelector('.story-image-wrap'),
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#fcfaf7] py-28 md:py-40"
    >
      {/* Décoration fond */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-40 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#e8dcc8]/30 to-transparent blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-[#043920]/5 to-transparent blur-[80px]" />
      </div>

      <div className="section-padding relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-28 xl:gap-40">

          {/* ── Colonne image ── */}
          <div className="story-image-wrap relative order-2 lg:order-1">
            {/* Cadre image principal */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_40px_120px_rgba(28,25,23,0.16)]">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Rituel Somacan"
                  className="h-[125%] w-full object-cover"
                  style={{ top: '-12.5%', position: 'relative' }}
                />
                {/* Overlay subtil */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent" />
              </div>
            </div>

            {/* Badge circulaire rotatif */}
            <div className="absolute -bottom-6 -right-6 z-20 flex h-36 w-36 items-center justify-center rounded-full border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(28,25,23,0.12)]">
              <div
                className="flex h-full w-full items-center justify-center rounded-full"
                style={{ animation: 'slowSpin 20s linear infinite' }}
              >
                <svg viewBox="0 0 120 120" className="absolute h-full w-full">
                  <defs>
                    <path id="circle" d="M 60,60 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  </defs>
                  <text className="fill-stone-400 text-[10px]" style={{ fontSize: '9.5px', letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}>
                    <textPath href="#circle">{badgeText} · {badgeText} · </textPath>
                  </text>
                </svg>
                <span className="text-[18px] text-stone-300">✦</span>
              </div>
            </div>

            {/* Petite étiquette en haut à gauche */}
            <div className="absolute -left-4 top-10 z-20 rounded-2xl border border-stone-200/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-stone-400">Fondé au</p>
              <p className="font-display text-2xl leading-none text-somacan-brand">Maroc</p>
            </div>
          </div>

          {/* ── Colonne texte ── */}
          <div className="order-1 lg:order-2">
            {/* Eyebrow */}
            <div className="story-reveal flex items-center gap-4 mb-10">
              <span className="block h-px w-12 bg-[#d49a2e]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-stone-400">
                {eyebrow}
              </p>
            </div>

            {/* Titre */}
            <h2 className="story-reveal font-display text-5xl leading-[1.05] text-somacan-brand md:text-6xl xl:text-7xl mb-10">
              {title}
            </h2>

            {/* Séparateur */}
            <div className="story-reveal mb-12 h-px w-16 bg-stone-200" />

            {/* Paragraphes */}
            <div className="story-reveal space-y-6 mb-14">
              <p className="text-lg font-light leading-relaxed text-stone-500">
                {paragraph1}
              </p>
              <p className="text-base font-light leading-relaxed text-stone-400">
                {paragraph2}
              </p>
            </div>

            {/* Stat avec avatars */}
            <div className="story-reveal flex items-center gap-6 rounded-[1.8rem] border border-stone-200/70 bg-white/70 px-7 py-5 shadow-[0_8px_40px_rgba(28,25,23,0.06)] backdrop-blur-sm w-fit">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-11 w-11 rounded-full border-[2.5px] border-white bg-gradient-to-br from-stone-200 to-stone-300 shadow-sm"
                  />
                ))}
              </div>
              <div className="border-l border-stone-200 pl-6">
                <p className="font-display text-3xl leading-none text-somacan-brand">
                  {statValue}
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.35em] text-stone-400">
                  {statLabel}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
