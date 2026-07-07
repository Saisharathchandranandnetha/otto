import type { Config } from 'tailwindcss';

// Otto Design Tokens — Stitch "Digital Hospitality" M3 System
// ────────────────────────────────────────────────────────────
// Warm, human-centric. Inspired by Indian kirana aesthetics:
//   Primary (Terracotta #9c3e26) — stamp of approval, brand energy
//   Secondary (Deep Teal #366667) — grounding, trust, approvals
//   Background (Warm Cream #fbf9f5) — paper-like, reduces eye strain
//   Surface layers — white cards on cream, stacked like quality paper
//
// Typography: Plus Jakarta Sans — friendly rounded terminals, high
// legibility for users transitioning from paper-based tracking.
//
// Mobile-first: 48px touch targets, 20px container padding, 8px base unit.

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── M3 Surface System ──────────────────────────────────
        surface: {
          DEFAULT: '#fbf9f5',
          dim: '#dbdad6',
          bright: '#fbf9f5',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3ef',
          'container': '#efeeea',
          'container-high': '#eae8e4',
          'container-highest': '#e4e2de',
          tint: '#9f4128',
          variant: '#e4e2de',
        },
        // ── M3 Primary (Terracotta) ────────────────────────────
        primary: {
          DEFAULT: '#9c3e26',
          container: '#bc563c',
          fixed: '#ffdbd2',
          'fixed-dim': '#ffb4a2',
        },
        'on-primary': { DEFAULT: '#ffffff', container: '#fffbff', fixed: '#3c0800', 'fixed-variant': '#7f2a13' },
        // ── M3 Secondary (Deep Teal) ───────────────────────────
        secondary: {
          DEFAULT: '#366667',
          container: '#baecec',
          fixed: '#baecec',
          'fixed-dim': '#9fcfd0',
        },
        'on-secondary': { DEFAULT: '#ffffff', container: '#3d6c6d', fixed: '#002020', 'fixed-variant': '#1c4e4f' },
        // ── M3 Tertiary (Olive) ────────────────────────────────
        tertiary: {
          DEFAULT: '#615c47',
          container: '#7b745e',
          fixed: '#ebe2c8',
          'fixed-dim': '#cec6ad',
        },
        'on-tertiary': { DEFAULT: '#ffffff', container: '#fffbff', fixed: '#1f1c0b', 'fixed-variant': '#4c4733' },
        // ── M3 Error ───────────────────────────────────────────
        error: { DEFAULT: '#ba1a1a', container: '#ffdad6' },
        'on-error': { DEFAULT: '#ffffff', container: '#93000a' },
        // ── M3 Neutral / Content ───────────────────────────────
        'on-surface': { DEFAULT: '#1b1c1a', variant: '#56423d' },
        'on-background': '#1b1c1a',
        background: '#fbf9f5',
        outline: { DEFAULT: '#89726c', variant: '#ddc0ba' },
        // ── M3 Inverse ────────────────────────────────────────
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f2f0ed',
        'inverse-primary': '#ffb4a2',
        // ── Legacy compat aliases (used in existing components) ─
        ink: { DEFAULT: '#1b1c1a', dim: '#56423d', faint: '#89726c' },
        accent: { DEFAULT: '#9c3e26', soft: '#9c3e2614', glow: '#9c3e2640' },
        good: '#366667',
        warm: '#fbc02d',
        bad: '#ba1a1a',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body-lg': ['18px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-lg': ['28px', { lineHeight: '36px', letterSpacing: '0em', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-md': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      spacing: {
        'base': '8px',
        'gutter': '16px',
        'container-padding': '20px',
        'stack-sm': '12px',
        'stack-md': '24px',
        'stack-lg': '40px',
        'touch-target-min': '48px',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      animation: {
        'slide-in': 'slideIn 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        'tick-up': 'tickUp 200ms ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'fade-in': 'fadeIn 400ms ease-out',
        'fade-in-up': 'fadeInUp 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        tickUp: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
