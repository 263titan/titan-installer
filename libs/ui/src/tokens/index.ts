// ─────────────────────────────────────────────────────────────────────────────
// Titan Design System — Design Tokens
// Single source of truth for all visual constants.
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  brand: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#1A56DB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },
  accent: {
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
  },
  // Neutrals
  gray: {
    50:  '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  // Semantic
  success: { light: '#ECFDF5', DEFAULT: '#059669', dark: '#065F46' },
  warning: { light: '#FFFBEB', DEFAULT: '#D97706', dark: '#92400E' },
  error:   { light: '#FEF2F2', DEFAULT: '#DC2626', dark: '#991B1B' },
  info:    { light: '#EFF6FF', DEFAULT: '#1A56DB', dark: '#1E3A8A' },
  // Surfaces
  surface: {
    base:     '#FFFFFF',
    raised:   '#F9FAFB',
    overlay:  '#F3F4F6',
    sunken:   '#E5E7EB',
    // Dark mode
    darkBase:    '#0D0D1A',
    darkRaised:  '#1F2937',
    darkOverlay: '#374151',
  },
} as const;

export const typography = {
  fontFamily: {
    sans:  '"Inter", "Segoe UI", system-ui, sans-serif',
    mono:  '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
  },
  fontSize: {
    xs:   '11px',
    sm:   '12px',
    base: '13px',
    md:   '14px',
    lg:   '16px',
    xl:   '18px',
    '2xl':'22px',
    '3xl':'28px',
  },
  fontWeight: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
  lineHeight: {
    tight:  1.25,
    snug:   1.375,
    normal: 1.5,
    relaxed:1.625,
  },
  letterSpacing: {
    tight:  '-0.01em',
    normal: '0',
    wide:   '0.025em',
    wider:  '0.05em',
    widest: '0.1em',
  },
} as const;

// 8-point spacing grid
export const spacing = {
  0:   '0px',
  0.5: '2px',
  1:   '4px',
  1.5: '6px',
  2:   '8px',
  2.5: '10px',
  3:   '12px',
  4:   '16px',
  5:   '20px',
  6:   '24px',
  7:   '28px',
  8:   '32px',
  10:  '40px',
  12:  '48px',
  16:  '64px',
  20:  '80px',
  24:  '96px',
} as const;

export const borderRadius = {
  none:  '0',
  sm:    '4px',
  DEFAULT:'6px',
  md:    '8px',
  lg:    '10px',
  xl:    '12px',
  '2xl': '16px',
  full:  '9999px',
} as const;

export const shadows = {
  none:  'none',
  xs:    '0 1px 2px 0 rgba(0,0,0,0.05)',
  sm:    '0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)',
  DEFAULT:'0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
  md:    '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)',
  lg:    '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)',
  xl:    '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)',
  inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)',
} as const;

export const transitions = {
  duration: { fast: '100ms', DEFAULT: '150ms', slow: '300ms' },
  timing:   { DEFAULT: 'cubic-bezier(0.4,0,0.2,1)', in: 'cubic-bezier(0.4,0,1,1)', out: 'cubic-bezier(0,0,0.2,1)' },
} as const;

export const zIndex = {
  base:    0,
  raised:  10,
  dropdown:100,
  sticky:  200,
  overlay: 300,
  modal:   400,
  popover: 500,
  toast:   600,
} as const;

// ── CSS custom properties injected into :root ─────────────────────────────────
export const typographyVariables = {
  '--titan-font-sans':      typography.fontFamily.sans,
  '--titan-font-mono':      typography.fontFamily.mono,
  '--titan-text-xs':        typography.fontSize.xs,
  '--titan-text-sm':        typography.fontSize.sm,
  '--titan-text-base':      typography.fontSize.base,
  '--titan-text-md':        typography.fontSize.md,
  '--titan-text-lg':        typography.fontSize.lg,
  '--titan-text-xl':        typography.fontSize.xl,
  '--titan-text-2xl':       typography.fontSize['2xl'],
  '--titan-text-3xl':       typography.fontSize['3xl'],
  '--titan-weight-normal':   String(typography.fontWeight.normal),
  '--titan-weight-medium':   String(typography.fontWeight.medium),
  '--titan-weight-semibold': String(typography.fontWeight.semibold),
  '--titan-weight-bold':     String(typography.fontWeight.bold),
  '--titan-leading-tight':   String(typography.lineHeight.tight),
  '--titan-leading-snug':    String(typography.lineHeight.snug),
  '--titan-leading-normal':  String(typography.lineHeight.normal),
  '--titan-leading-relaxed': String(typography.lineHeight.relaxed),
  '--titan-tracking-tight':  typography.letterSpacing.tight,
  '--titan-tracking-normal': typography.letterSpacing.normal,
  '--titan-tracking-wide':   typography.letterSpacing.wide,
  '--titan-tracking-wider':  typography.letterSpacing.wider,
  '--titan-tracking-widest': typography.letterSpacing.widest,
} as const;

export const cssVariables = {
  light: {
    '--titan-bg':           colors.surface.base,
    '--titan-bg-raised':    colors.surface.raised,
    '--titan-bg-overlay':   colors.surface.overlay,
    '--titan-text':         colors.gray[900],
    '--titan-text-muted':   colors.gray[500],
    '--titan-text-subtle':  colors.gray[400],
    '--titan-border':       colors.gray[200],
    '--titan-border-strong':colors.gray[300],
    '--titan-brand':        colors.brand[600],
    '--titan-brand-light':  colors.brand[50],
    '--titan-accent':       colors.accent[500],
    '--titan-success':      colors.success.DEFAULT,
    '--titan-warning':      colors.warning.DEFAULT,
    '--titan-error':        colors.error.DEFAULT,
    '--titan-info':         colors.info.DEFAULT,
  },
  dark: {
    '--titan-bg':           colors.surface.darkBase,
    '--titan-bg-raised':    colors.surface.darkRaised,
    '--titan-bg-overlay':   colors.surface.darkOverlay,
    '--titan-text':         colors.gray[50],
    '--titan-text-muted':   colors.gray[400],
    '--titan-text-subtle':  colors.gray[500],
    '--titan-border':       colors.gray[700],
    '--titan-border-strong':colors.gray[600],
    '--titan-brand':        colors.brand[400],
    '--titan-brand-light':  colors.brand[950],
    '--titan-accent':       colors.accent[400],
    '--titan-success':      colors.success.DEFAULT,
    '--titan-warning':      colors.warning.DEFAULT,
    '--titan-error':        colors.error.DEFAULT,
    '--titan-info':         colors.info.DEFAULT,
  },
} as const;

export type Theme = 'light' | 'dark' | 'system';
