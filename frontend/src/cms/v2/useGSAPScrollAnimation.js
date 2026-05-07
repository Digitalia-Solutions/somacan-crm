/**
 * useGSAPScrollAnimation.js
 *
 * Hook that applies GSAP ScrollTrigger animations based on AnimationEngine presets.
 * Supports: parallax, scroll-velocity, parallax-layers, horizontal-pin-scroll
 *
 * Usage:
 *   const ref = useRef(null);
 *   useGSAPScrollAnimation(ref, { type: 'parallax', scrub: true, yPercent: 18 });
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getGSAPPreset, isGSAPAnimation, toGSAPEase } from '../AnimationEngine';

gsap.registerPlugin(ScrollTrigger);

export default function useGSAPScrollAnimation(
  containerRef,
  animationConfig = {},
  deps = []
) {
  const triggersRef = useRef([]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const type = animationConfig?.type;
    if (!type || !isGSAPAnimation(type)) return;

    const preset = getGSAPPreset(type);
    if (!preset) return;

    const ctx = gsap.context(() => {
      const defaults = preset.defaults || {};
      const config = { ...defaults, ...animationConfig };

      switch (type) {
        case 'parallax': {
          const tween = gsap.to(container, {
            yPercent: config.yPercent ?? 18,
            ease: config.ease || 'none',
            scrollTrigger: {
              trigger: container,
              start: config.start || 'top bottom',
              end: config.end || 'bottom top',
              scrub: config.scrub !== false,
            },
          });
          triggersRef.current.push(tween.scrollTrigger);
          break;
        }

        case 'scroll-velocity': {
          const tween = gsap.to(container, {
            yPercent: config.yPercent ?? 10,
            skewY: config.skewY ?? 1.5,
            ease: config.ease || 'power1.out',
            scrollTrigger: {
              trigger: container,
              start: config.start || 'top bottom',
              end: config.end || 'bottom top',
              scrub: config.scrub !== false,
            },
          });
          triggersRef.current.push(tween.scrollTrigger);
          break;
        }

        case 'parallax-layers': {
          const layers = container.querySelectorAll('[data-parallax-layer]');
          const depths = config.depth || [0.15, 0.3, 0.45];
          layers.forEach((layer, i) => {
            const depth = depths[i % depths.length];
            const tween = gsap.to(layer, {
              yPercent: -100 * depth,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: config.start || 'top bottom',
                end: config.end || 'bottom top',
                scrub: config.scrub !== false,
              },
            });
            triggersRef.current.push(tween.scrollTrigger);
          });
          break;
        }

        case 'horizontal-pin-scroll': {
          const track = container.querySelector('[data-horizontal-track]');
          if (track) {
            const tween = gsap.to(track, {
              xPercent: -100,
              ease: config.ease || 'none',
              scrollTrigger: {
                trigger: container,
                start: config.start || 'top top',
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                pin: config.pin !== false,
                scrub: config.scrub !== false,
                snap: config.snap
                  ? {
                      snapTo: 1 / (track.children.length - 1),
                      duration: { min: 0.15, max: 0.35 },
                      ease: 'power2.inOut',
                    }
                  : false,
              },
            });
            triggersRef.current.push(tween.scrollTrigger);
          }
          break;
        }

        default:
          break;
      }
    }, container);

    return () => {
      triggersRef.current.forEach((st) => st?.kill());
      triggersRef.current = [];
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps]);
}

/**
 * Utility: apply a stagger reveal animation to child elements.
 * Uses GSAP for smoother stagger control than Framer Motion in some cases.
 */
export function useGSAPStaggerReveal(
  containerRef,
  animationConfig = {},
  selector = '[data-stagger-item]',
  deps = []
) {
  const triggersRef = useRef([]);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const items = container.querySelectorAll(selector);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      const tween = gsap.from(items, {
        y: animationConfig.y ?? 30,
        opacity: 0,
        duration: (animationConfig.duration || 900) / 1000,
        stagger: (animationConfig.stagger || 100) / 1000,
        ease: toGSAPEase(animationConfig.easing) || 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: animationConfig.start || 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      triggersRef.current.push(tween.scrollTrigger);
    }, container);

    return () => {
      triggersRef.current.forEach((st) => st?.kill());
      triggersRef.current = [];
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, ...deps]);
}
