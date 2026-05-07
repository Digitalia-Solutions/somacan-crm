import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({ src, alt, className = '', speed = 0.5 }) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      yPercent: speed * 30,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  }, { scope: ref });

  return (
    <div className={`overflow-hidden ${className}`}>
      <img 
        ref={ref} 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover scale-110"
      />
    </div>
  );
}
