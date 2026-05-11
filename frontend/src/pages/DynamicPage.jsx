import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getPageBySlug } from '../lib/api';
import PageRenderer from '../cms/v2/PageRenderer';
import Noise from '../components/Noise';
import { usePageChrome } from '../context/PageChromeContext';

// Section types that embed their own full-screen navbar
const SELF_CONTAINED_HEROES = ['WheelHero'];

gsap.registerPlugin(ScrollTrigger);

/**
 * DynamicPage — CMS-first page renderer
 *
 * Props:
 *   slug — (optional) page slug to load from CMS. Defaults to 'home' or URL param
 *   Fallback — (optional) React component to render if CMS page not found
 *
 * Behavior:
 *   1. Loads page from CMS API via slug
 *   2. If sections exist: renders via PageRenderer
 *   3. If no sections: renders Fallback component if provided
 *   4. If no Fallback and no sections: renders null (empty page)
 */
export default function DynamicPage({ slug: explicitSlug, Fallback = null }) {
  const { slug: paramSlug = 'home' } = useParams();
  // Allow explicit slug prop OR use URL param
  const slug = explicitSlug || paramSlug;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const { setHideNavbar } = usePageChrome();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const prevTitle = document.title;

    console.log("[CMSPage] Loading slug:", slug);

    getPageBySlug(slug)
      .then((data) => {
        setPage(data);
        const sections = Array.isArray(data.sections) ? data.sections : [];
        console.log("[CMSPage]", slug, sections.length, sections);

        // Update SEO
        const seo = data.seo || {};
        document.title = seo.metaTitle || data.metaTitle || data.title || 'Somacan';

        function setMeta(attr, attrVal, content) {
          if (!content) return;
          let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
          if (!el) { el = document.createElement('meta'); el.setAttribute(attr, attrVal); document.head.appendChild(el); }
          el.setAttribute('content', content);
        }
        function setLink(rel, href) {
          if (!href) return;
          let el = document.querySelector(`link[rel="${rel}"]`);
          if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
          el.setAttribute('href', href);
        }

        const metaDesc = seo.metaDescription || data.metaDescription;
        const ogImage = seo.ogImage || data.ogImage;
        const canonicalUrl = seo.canonicalUrl || data.canonicalUrl;
        const noIndex = seo.noIndex ?? data.noIndex ?? false;

        setMeta('name', 'description', metaDesc);
        setMeta('property', 'og:title', seo.metaTitle || data.metaTitle || data.title);
        setMeta('property', 'og:description', metaDesc);
        setMeta('property', 'og:image', ogImage);
        setMeta('property', 'og:type', 'website');
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', seo.metaTitle || data.metaTitle || data.title);
        setMeta('name', 'twitter:description', metaDesc);
        setMeta('name', 'twitter:image', ogImage);
        setLink('canonical', canonicalUrl || window.location.href);

        let robotsMeta = document.querySelector('meta[name="robots"]');
        if (noIndex) {
          if (!robotsMeta) { robotsMeta = document.createElement('meta'); robotsMeta.setAttribute('name', 'robots'); document.head.appendChild(robotsMeta); }
          robotsMeta.setAttribute('content', 'noindex,nofollow');
        } else if (robotsMeta) {
          robotsMeta.remove();
        }

        const first = sections.find((s) => s.isActive !== false);
        setHideNavbar(first ? SELF_CONTAINED_HEROES.includes(first.type) : false);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load page');
        setHideNavbar(false);
        setLoading(false);
      });

    return () => {
      document.title = prevTitle;
      setHideNavbar(false);
    };
  }, [slug, setHideNavbar]);

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
        onEnter: () => gsap.to(document.body, { backgroundColor: bgColor, color: textColor, duration: 1.2, ease: 'power2.inOut' }),
        onEnterBack: () => gsap.to(document.body, { backgroundColor: bgColor, color: textColor, duration: 1.2, ease: 'power2.inOut' }),
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

  // If error or no sections in page, try to render Fallback component
  if (error || !page || !Array.isArray(page.sections) || page.sections.length === 0) {
    if (Fallback) {
      return <Fallback />;
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7] px-6">
          <div className="max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Erreur de chargement</p>
            <h1 className="mt-4 font-display text-4xl text-somacan-brand">Cette page n&apos;a pas pu charger.</h1>
            <p className="mt-4 text-sm leading-7 text-stone-500">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <main ref={containerRef} className="relative w-full bg-[#fcfaf7]">
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]">
        <Noise />
      </div>

      <PageRenderer page={page} />
    </main>
  );
}
