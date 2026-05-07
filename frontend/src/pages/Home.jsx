import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getPageBySlug } from '../lib/api';
import SectionRenderer from '../components/cms/SectionRenderer';
import Noise from '../components/Noise';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    getPageBySlug('home')
      .then(data => {
        setSections(data.sections || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading home content:', err);
        setLoading(false);
      });
  }, []);

  useGSAP(() => {
    if (loading) return;
    const targets = gsap.utils.toArray('[data-theme]');

    targets.forEach((section) => {
      const theme = section.getAttribute('data-theme');
      const bgColor = theme === 'dark' ? '#1c1917' : '#fcfaf7';
      const textColor = theme === 'dark' ? '#f5f5f4' : '#1c1917';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => gsap.to('body', { backgroundColor: bgColor, color: textColor, duration: 1.2, ease: 'power2.inOut' }),
        onEnterBack: () => gsap.to('body', { backgroundColor: bgColor, color: textColor, duration: 1.2, ease: 'power2.inOut' }),
      });
    });
  }, { scope: containerRef, dependencies: [loading] });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fcfaf7]">
        <div className="w-10 h-10 border-t-2 border-stone-300 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main ref={containerRef} className="relative w-full overflow-hidden bg-[#fcfaf7]">
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]">
        <Noise />
      </div>

      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}
