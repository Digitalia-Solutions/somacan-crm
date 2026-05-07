import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 5000, suffix: '+', label: 'Clientes Satisfaites', desc: 'Au Maroc & à l\'international' },
  { value: 100, suffix: '%', label: 'Actifs Naturels', desc: 'Zéro additif chimique' },
  { value: 4.9, suffix: '★', label: 'Note Moyenne', desc: 'Sur 800+ avis vérifiés' },
  { value: 48, suffix: 'h', label: 'Livraison Express', desc: 'Partout au Maroc' },
];

function StatCounter({ value, suffix, isFloat }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        const start = Date.now();
        const duration = 1800;
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = isFloat ? +(value * eased).toFixed(1) : Math.round(value * eased);
          setDisplay(current);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, isFloat]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

export default function StatsSection({ items }) {
  const currentStats = items && items.length > 0 ? items : stats;
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.stat-item', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-[#fcfaf7]">
      <div className="section-padding max-w-[100rem] mx-auto">
        <div className="rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,238,0.98))] shadow-[0_30px_90px_rgba(28,25,23,0.06)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0">
          {currentStats.map((stat, i) => (
            <div key={i} className="stat-item relative flex flex-col items-center text-center px-8 py-10 md:py-12">
              {i > 0 ? <div className="absolute left-0 top-[18%] bottom-[18%] hidden xl:block w-px bg-stone-200" /> : null}
              <p className="font-display text-5xl md:text-6xl xl:text-7xl text-gold-500 leading-none mb-4 tabular-nums">
                <StatCounter 
                  value={parseFloat(stat.value)} 
                  suffix={stat.icon || stat.suffix || ''} 
                  isFloat={!Number.isInteger(parseFloat(stat.value))} 
                />
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-900 mb-2">{stat.label}</p>
              <p className="max-w-[14rem] text-[12px] text-stone-500 font-light leading-relaxed">{stat.desc || stat.label}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
