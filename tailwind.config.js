/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Core palette (driven by CSS variables in globals.css) ──
        ink: {
          DEFAULT: 'var(--ink)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
        },
        ash: {
          DEFAULT: 'var(--ash)',
          200: 'var(--ash-200)',
          300: 'var(--ash-300)',
          400: 'var(--ash-400)',
          500: 'var(--ash-500)',
        },
        copper: { DEFAULT: '#c4703f', light: '#d98a58', dark: '#a05530' },
        // ── Utility ───────────────────────────────────────────────
        surface: 'var(--ink-800)',
        card:    'var(--ink-700)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      animation: {
        'word-in':   'wordIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-up':   'fadeUp 1s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':   'fadeIn 1s ease forwards',
        'line-grow': 'lineGrow 1s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        wordIn:   { from: { opacity:0, transform:'translateY(120%) rotate(3deg)' }, to: { opacity:1, transform:'translateY(0) rotate(0deg)' } },
        fadeUp:   { from: { opacity:0, transform:'translateY(40px)' },              to: { opacity:1, transform:'translateY(0)' } },
        fadeIn:   { from: { opacity:0 },                                            to: { opacity:1 } },
        lineGrow: { from: { transform:'scaleX(0)' },                               to: { transform:'scaleX(1)' } },
      },
    },
  },
  plugins: [],
}
