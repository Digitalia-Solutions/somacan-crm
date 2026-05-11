/**
 * AnimationEngine.js
 *
 * Framer Motion variant presets and utility functions for CMS section and widget animations.
 * Supports Framer Motion presets and advanced GSAP presets for future live preview/canvas work.
 */

/**
 * Framer Motion variant presets for different animation types
 */


export const FM_VARIANTS = {
  'fade-up': {
    hidden: { opacity: 0, y: 40 },
    visible: (custom = {}) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (custom.duration || 1200) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: custom.easing === 'spring'
          ? [0.34, 1.56, 0.64, 1]
          : [0.22, 1, 0.36, 1],
      },
    }),
  },
  'fade-down': {
    hidden: { opacity: 0, y: -40 },
    visible: (custom = {}) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (custom.duration || 1000) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'fade-left': {
    hidden: { opacity: 0, x: 60 },
    visible: (custom = {}) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: (custom.duration || 1000) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'fade-right': {
    hidden: { opacity: 0, x: -60 },
    visible: (custom = {}) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: (custom.duration || 1000) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'zoom-in': {
    hidden: { opacity: 0, scale: 0.85 },
    visible: (custom = {}) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: (custom.duration || 800) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.34, 1.56, 0.64, 1],
      },
    }),
  },
  'zoom-out': {
    hidden: { opacity: 0, scale: 1.15 },
    visible: (custom = {}) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: (custom.duration || 900) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  reveal: {
    hidden: { opacity: 0, y: 30 },
    visible: (custom = {}) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (custom.duration || 1000) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'stagger-cards': {
    hidden: { opacity: 0, y: 30 },
    visible: (custom = {}, i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (custom.duration || 800) / 1000,
        delay: ((custom.delay || 0) + i * (custom.stagger || 100)) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  stagger: {
    hidden: { opacity: 0, y: 30 },
    visible: (custom = {}, i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (custom.duration || 800) / 1000,
        delay: ((custom.delay || 0) + i * (custom.stagger || 100)) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'stagger-reveal': {
    hidden: { opacity: 0, y: 24 },
    visible: (custom = {}, i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (custom.duration || 900) / 1000,
        delay: ((custom.delay || 0) + i * (custom.stagger || 80)) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'split-text': {
    hidden: { opacity: 0, y: '0.8em' },
    visible: (custom = {}, i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: (custom.duration || 700) / 1000,
        delay: ((custom.delay || 0) + i * (custom.stagger || 30)) / 1000,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  },
  'magnetic-hover': {
    hidden: { opacity: 0, scale: 0.98 },
    visible: (custom = {}) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: (custom.duration || 500) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.34, 1.56, 0.64, 1],
      },
    }),
  },
  'flip-in': {
    hidden: { opacity: 0, rotateX: 45, y: 20 },
    visible: (custom = {}) => ({
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: (custom.duration || 900) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    visible: (custom = {}) => ({
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: (custom.duration || 800) / 1000,
        delay: (custom.delay || 0) / 1000,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  },
  none: {
    hidden: {},
    visible: {},
  },
};

/**
 * All animation types for UI selectors.
 */
export const GSAP_PRESETS = {
  parallax: {
    requiresScrollTrigger: true,
    defaults: { scrub: true, yPercent: 18, ease: 'none' },
    label: 'Parallax',
  },
  'scroll-velocity': {
    requiresScrollTrigger: true,
    defaults: { scrub: true, yPercent: 10, skewY: 1.5, ease: 'power1.out' },
    label: 'Scroll Velocity',
  },
  'parallax-layers': {
    requiresScrollTrigger: true,
    defaults: { scrub: true, depth: [0.15, 0.3, 0.45] },
    label: 'Parallax Layers',
  },
  'horizontal-pin-scroll': {
    requiresScrollTrigger: true,
    defaults: { pin: true, scrub: true, snap: false },
    label: 'Horizontal Pin Scroll',
  },
  'magnetic-hover-gsap': {
    label: 'Magnetic Hover (GSAP)',
    requiresInteractive: true,
  },
};

export const ANIMATION_TYPES = Object.keys(FM_VARIANTS).concat(Object.keys(GSAP_PRESETS));

/**
 * Get Framer Motion variants for a given animation config
 * @param {Object} animationConfig - { type, duration, delay, easing, stagger, triggerOnScroll }
 * @returns {Object} Framer Motion variant object
 */
export function getFMVariants(animationConfig) {
  const type = animationConfig?.type || 'none';
  return FM_VARIANTS[type] || FM_VARIANTS['none'];
}

/**
 * Check if animation type requires GSAP (e.g., parallax with ScrollTrigger)
 * @param {string} type - Animation type
 * @returns {boolean}
 */
export function isGSAPAnimation(type) {
  return Boolean(GSAP_PRESETS[type]);
}

/**
 * Map easing string to GSAP ease string
 * @param {string} easing - Easing name
 * @returns {string} GSAP ease string
 */
export function toGSAPEase(easing) {
  const map = {
    'ease-out': 'power2.out',
    'power3.out': 'power3.out',
    spring: 'elastic.out(1, 0.3)',
    bounce: 'bounce.out',
    'ease-in-out': 'power2.inOut',
    'power1.out': 'power1.out',
    none: 'none',
  };
  return map[easing] || 'power3.out';
}

export function getGSAPPreset(type) {
  return GSAP_PRESETS[type] || null;
}

/**
 * Get human-readable label for an animation type.
 */
export function getAnimationLabel(type) {
  if (FM_VARIANTS[type] && type !== 'none') {
    return type
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  if (GSAP_PRESETS[type]) {
    return GSAP_PRESETS[type].label;
  }
  return 'None';
}

/**
 * Build a flat list of all animation options for select fields.
 */
export function getAnimationOptions() {
  const fm = Object.keys(FM_VARIANTS)
    .filter((k) => k !== 'none')
    .map((value) => ({ value, label: getAnimationLabel(value), category: 'Framer Motion' }));
  const gsap = Object.keys(GSAP_PRESETS).map((value) => ({
    value,
    label: GSAP_PRESETS[value].label,
    category: 'GSAP ScrollTrigger',
  }));
  return [
    { value: 'none', label: 'None', category: 'None' },
    ...fm,
    ...gsap,
  ];
}
