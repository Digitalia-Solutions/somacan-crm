import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "L'huile relaxante Somacan a complètement changé ma routine du soir. La texture est fine, le parfum est subtil et ma peau reste souple jusqu'au matin.",
    author: 'Salma B.',
    city: 'Casablanca',
  },
  {
    quote:
      "J'ai rarement vu une marque marocaine avec une identité aussi maîtrisée. Tout paraît calme, cohérent et réellement premium, du produit jusqu'à l'expérience.",
    author: 'Meryem A.',
    city: 'Rabat',
  },
  {
    quote:
      "La crème corps à l'argan pénètre vite, sans effet lourd, et laisse une vraie sensation de confort. C'est le type de soin qu'on rachète sans hésiter.",
    author: 'Nadia M.',
    city: 'Marrakech',
  },
  {
    quote:
      "Ce que j'aime le plus, c'est la sensation de rituel. On n'utilise pas juste un produit, on prend vraiment un moment pour soi.",
    author: 'Imane K.',
    city: 'Tanger',
  },
];

function Stars() {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} className="h-4 w-4 fill-gold-400 text-gold-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection({ title, subtitle, items }) {
  const currentTestimonials = items && items.length > 0 ? items : testimonials;
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.testimonials-reveal', {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 78%',
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="overflow-hidden bg-[linear-gradient(180deg,#fcfaf7_0%,#f3eee4_100%)] py-24">
      <div className="section-padding mx-auto max-w-6xl">
        <div className="testimonials-reveal mb-14 text-center">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">
            Echos de Beaute
          </p>
          <h2 className="font-display text-5xl leading-[0.95] text-somacan-brand md:text-7xl">
            {title || "Ce qu'elles disent"}
            <br />
            <span className="font-light italic text-gold-500">{subtitle || "de Somacan."}</span>
          </h2>
        </div>

        <div className="testimonials-reveal relative">
          <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[#c9aa73]/15 blur-3xl" />
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            slidesPerView={1}
            loop
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1000}
            autoplay={{
              delay: 4800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            className="somacan-testimonials !overflow-visible"
          >
            {currentTestimonials.map((item, idx) => (
              <SwiperSlide key={`${item.author}-${idx}`}>
                <article className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.25rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(252,250,247,0.98)_100%)] px-8 py-12 text-center shadow-[0_25px_80px_rgba(28,25,23,0.08)] md:px-18 md:py-16">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9aa73]/60 to-transparent" />
                  <div className="pointer-events-none absolute left-8 top-6 font-display text-8xl leading-none text-[#c9aa73]/18 md:text-9xl">
                    "
                  </div>
                  <div className="relative z-10">
                    <Stars />
                    <p className="mx-auto mt-8 max-w-3xl font-display text-[1.6rem] leading-[1.08] text-somacan-brand md:text-[1.6rem]">
                      {item.quote}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                      <div className="h-px w-10 bg-[#c9aa73]/35" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-stone-900">
                          {item.author}
                        </p>
                        <p className="mt-2 text-[11px] text-stone-400">{item.city}</p>
                      </div>
                      <div className="h-px w-10 bg-[#c9aa73]/35" />
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="testimonials-reveal mt-10 text-center">
          <p className="text-[11px] text-stone-400">4.9/5 · plus de 800 avis verifies</p>
        </div>
      </div>
    </section>
  );
}
