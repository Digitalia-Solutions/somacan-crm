import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: "5,000+", label: "Clientes Satisfaites" },
  { number: "100%", label: "Actifs Naturels" },
  { number: "3", label: "Collections Signature" },
  { number: "0%", label: "Additifs Chimiques" },
  { number: "4.9★", label: "Note Moyenne" },
  { number: "48h", label: "Livraison Express" },
];

const certifications = [
  "✦ Certifié Halal",
  "✦ Cruelty-Free",
  "✦ Vegan Friendly",
  "✦ Dermatologiquement Testé",
  "✦ Fabriqué au Maroc",
  "✦ ISO 22716",
  "✦ Sans Parabènes",
  "✦ CBD de Grade Médicinal",
].map((label) => ({ label }));

export default function BrandMarquee({ stats: cmsStats, certifications: cmsCertifications }) {
  const containerRef = useRef(null);
  const currentStats = cmsStats && cmsStats.length > 0 ? cmsStats : stats;
  const currentCertifications = cmsCertifications && cmsCertifications.length > 0 ? cmsCertifications : certifications;

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="py-10 bg-stone-50 border-y border-stone-100 overflow-hidden">
      {/* Row 1 — stats scrolling left */}
      <div className="overflow-hidden mb-4">
        <div className="flex whitespace-nowrap animate-marquee-fast">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-baseline shrink-0">
              {currentStats.map((stat, j) => (
                <div key={j} className="flex items-baseline gap-3 px-10 shrink-0">
                  <span className="font-display text-3xl text-stone-900 leading-none">{stat.number}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400">{stat.label}</span>
                  <span className="text-stone-200 ml-8">|</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — certifications scrolling right */}
      <div className="overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {currentCertifications.map((cert, j) => (
                <span key={j} className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-400 italic px-8 whitespace-nowrap shrink-0">
                  {cert.label || cert}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
