/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Core palette ──────────────────────────────────
        ink:    { DEFAULT: '#0d0d0d', 800: '#1a1a1a', 700: '#242424', 600: '#2e2e2e', 500: '#3d3d3d' },
        ash:    { DEFAULT: '#f0ebe3', 200: '#e8e2d9', 300: '#d4cdc3', 400: '#b0a89e', 500: '#7a746c' },
        copper: { DEFAULT: '#c4703f', light: '#d98a58', dark: '#a05530' },
        // ── Utility ───────────────────────────────────────
        surface: '#141414',
        card:    '#1c1c1c',
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
