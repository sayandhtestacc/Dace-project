/**
 * DUK Hub — Design Tokens (TypeScript mirror of CSS variables)
 * Use these for inline styles and dynamic calculations.
 */

export const colors = {
  bg: '#F5F6FA',
  surface: '#FFFFFF',
  dark: '#2B2644',
  darkest: '#11101D',
  text: '#141320',
  textMuted: '#64677A',
  textOnDark: '#FFFFFF',
  textOnDarkMut: '#C9C7DA',
  gradSoftFrom: '#E9ECF6',
  gradSoftTo: '#C5CBE8',
  border: 'rgba(43, 38, 68, 0.08)',
  focus: '#2B2644',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const

export const radius = {
  sm: '12px',
  md: '20px',
  lg: '28px',
  pill: '9999px',
} as const

export const shadows = {
  ambient: '0 24px 60px -24px rgba(43, 38, 68, 0.28)',
  card: '0 4px 24px -4px rgba(43, 38, 68, 0.08)',
  cardHover: '0 12px 40px -8px rgba(43, 38, 68, 0.18)',
  glass: '0 8px 32px -8px rgba(43, 38, 68, 0.12)',
} as const

export const layout = {
  maxWidth: '1200px',
  navHeight: '72px',
  sectionGap: '80px',
  gridGap: '20px',
  paddingMobile: '24px',
  paddingDesktop: '48px',
} as const

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
} as const
