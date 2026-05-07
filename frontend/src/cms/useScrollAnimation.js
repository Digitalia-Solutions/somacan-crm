/**
 * useScrollAnimation.js
 *
 * React hook that uses Framer Motion's useInView to animate a section
 * when it enters the viewport.
 */

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { getFMVariants, isGSAPAnimation } from './AnimationEngine';

/**
 * Hook to manage scroll-triggered animations
 * @param {Object} animationConfig - { type, duration, delay, easing, stagger, triggerOnScroll }
 * @returns {Object} { ref, inView, variants, shouldAnimate }
 */
export default function useScrollAnimation(animationConfig) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const variants = getFMVariants(animationConfig);
  const shouldAnimate =
    animationConfig?.triggerOnScroll !== false &&
    animationConfig?.type &&
    animationConfig.type !== 'none' &&
    !isGSAPAnimation(animationConfig.type);

  return { ref, inView, variants, shouldAnimate };
}
