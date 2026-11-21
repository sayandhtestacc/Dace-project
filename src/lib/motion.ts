/**
 * DUK Hub — Motion System (Single Source of Truth)
 * All animation tokens, variants, and utilities.
 */

// ─── Physics ───
export const spring = { type: 'spring' as const, stiffness: 260, damping: 24, mass: 0.9 }
export const springGentle = { type: 'spring' as const, stiffness: 180, damping: 20, mass: 1 }
export const springBouncy = { type: 'spring' as const, stiffness: 400, damping: 28, mass: 0.8 }

export const ease = [0.22, 1, 0.36, 1] as const

export const dur = {
  fast: 0.2,
  base: 0.32,
  slow: 0.48,
  hero: 0.7,
} as const

export const stagger = 0.08
export const lift = 16

// ─── Reduced Motion ───
export const getReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ─── Framer Motion Variants ───

/** Fade up — default page/element entrance */
export const fadeUp = {
  initial: { opacity: 0, y: lift },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

/** Fade in only (for reduced motion) */
export const fadeOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/** Staggered container */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.1,
    },
  },
}

/** Hero stagger — 80ms intervals */
export const heroStagger = {
  animate: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.2,
    },
  },
}

/** Scale up (for modals) */
export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

/** Slide from right (for drawers) */
export const slideRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
}

/** Slide from left */
export const slideLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
}

/** Word mask reveal */
export const wordMask = {
  initial: { y: '110%' },
  animate: { y: '0%' },
}

/** Counter animation helper */
export const counterConfig = {
  duration: dur.hero,
  ease: 'easeOut' as const,
}

/** Tab content crossfade */
export const tabCrossfade = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
}

/** List item layout */
export const listItem = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
}

/** Toast enter/exit */
export const toastMotion = {
  initial: { opacity: 0, y: 50, x: 0 },
  animate: { opacity: 1, y: 0, x: 0 },
  exit: { opacity: 0, x: 100 },
}

/** Shake for validation */
export const validationShake = {
  x: [0, -6, 6, -4, 4, -2, 2, 0],
  transition: { duration: 0.4 },
}

/** Page transition defaults */
export const pageTransition = {
  initial: { opacity: 0, y: lift },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...spring, duration: dur.base },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: dur.fast },
  },
}

/** Bento cascade (diagonal stagger) */
export const bentoCascade = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export const bentoChild = {
  initial: { opacity: 0, y: 24, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring,
  },
}
