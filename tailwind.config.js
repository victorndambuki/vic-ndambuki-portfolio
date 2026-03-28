/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        none:    '0',
        sm:      '8px',
        DEFAULT: '12px',
        md:      '14px',
        lg:      '18px',
        xl:      '22px',
        '2xl':   '28px',
        full:    '9999px',
      },
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink)     / <alpha-value>)',
          800:     'rgb(var(--ink-800) / <alpha-value>)',
          700:     'rgb(var(--ink-700) / <alpha-value>)',
          600:     'rgb(var(--ink-600) / <alpha-value>)',
          500:     'rgb(var(--ink-500) / <alpha-value>)',
        },
        ash: {
          DEFAULT: 'rgb(var(--ash)     / <alpha-value>)',
          200:     'rgb(var(--ash-200) / <alpha-value>)',
          300:     'rgb(var(--ash-300) / <alpha-value>)',
          400:     'rgb(var(--ash-400) / <alpha-value>)',
          500:     'rgb(var(--ash-500) / <alpha-value>)',
        },
        copper: {
          DEFAULT: 'rgb(var(--copper)       / <alpha-value>)',
          light:   'rgb(var(--copper-light) / <alpha-value>)',
          dark:    'rgb(var(--copper-dark)  / <alpha-value>)',
        },
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card:    'rgb(var(--card)    / <alpha-value>)',
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
