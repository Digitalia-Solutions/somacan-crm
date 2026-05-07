import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplitTextReveal({ text, className = '', tag: Tag = 'h2' }) {
  const ref = useRef(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const chars = el.querySelectorAll('.char');

    gsap.from(chars, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  }, { scope: ref });

  const chars = text.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}>
      {char === ' ' ? ' ' : char}
    </span>
  ));

  return (
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      {chars}
    </Tag>
  );
}
