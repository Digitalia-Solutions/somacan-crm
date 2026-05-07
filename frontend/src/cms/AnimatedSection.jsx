/**
 * AnimatedSection.jsx
 *
 * A wrapper component that applies entrance animations to any CMS section.
 * Supports Framer Motion-based animations triggered on scroll or on mount.
 */

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { getFMVariants, isGSAPAnimation } from './AnimationEngine';

/**
 * AnimatedSection — wraps content with entrance animation based on section.animation config.
 * Falls back to no animation if type is 'none' or not set.
 *
 * @param {Object} props
 * @param {Object} props.animation - { type, duration, delay, easing, stagger, triggerOnScroll }
 * @param {string} [props.className] - Extra CSS classes on wrapper
 * @param {Object} [props.style] - Inline styles on wrapper
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.dataTheme] - data-theme attribute value
 */
export default function AnimatedSection({
  animation = {},
  className = '',
  style = {},
  children,
  dataTheme,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const type = animation?.type || 'none';
  const triggerOnScroll = animation?.triggerOnScroll !== false;
  const variants = getFMVariants(animation);
  const shouldAnimate = type !== 'none' && triggerOnScroll && !isGSAPAnimation(type);

  // If no animation needed, render simple div
  if (!shouldAnimate) {
    return (
      <div className={className} style={style} data-theme={dataTheme}>
        {children}
      </div>
    );
  }

  // Render with Framer Motion animation
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      data-theme={dataTheme}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      custom={animation}
    >
      {children}
    </motion.div>
  );
}
