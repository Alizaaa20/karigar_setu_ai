/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens for "Karigar Setu" — inspired by Indian block-print /
        // natural-dye textile traditions (indigo, madder root, turmeric) so
        // the palette speaks to the artisan-craft subject rather than a
        // generic SaaS theme.
        paper: '#FFF8EC', // warm handmade-paper background
        ink: '#2B2118', // warm near-black for body text
        indigo: {
          50: '#EEF1FA',
          100: '#D6DDF0',
          400: '#4A5E9C',
          500: '#2B3A67', // primary — block-print indigo dye
          600: '#212C4F',
          700: '#181F39',
        },
        madder: {
          50: '#FBEBE9',
          400: '#C24B41',
          500: '#A8322D', // CTA / accent — madder-root red dye
          600: '#832620',
        },
        turmeric: {
          100: '#FBEACB',
          400: '#EFB758',
          500: '#E8A33D', // secondary accent — turmeric dye
          600: '#C2822A',
        },
        thread: '#C9BBA0', // muted tan for dividers / stitch motifs
      },
      fontFamily: {
        display: ['"Baloo 2"', 'ui-rounded', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px -8px rgba(43, 33, 24, 0.18)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
};
