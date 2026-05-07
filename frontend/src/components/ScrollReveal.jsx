import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  distance = 80,
  duration = 1.2,
  ease = 'power3.out'
}) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars = {
      opacity: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    };

    if (direction === 'up') fromVars.y = distance;
    if (direction === 'down') fromVars.y = -distance;
    if (direction === 'left') fromVars.x = distance;
    if (direction === 'right') fromVars.x = -distance;

    gsap.from(el, fromVars);
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
