import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /**
         * Semantic UI palette — light editorial. Names describe the role, not
         * the colour, so swapping the palette is a change to this block alone.
         * Values sampled from the reference interface rather than estimated.
         */
        ui: {
          paper: '#FCFCFA',        // page ground, faintly warm off-white
          surface: '#FFFFFF',      // cards and raised panels
          shell: '#F6F6F4',        // recessed: inputs, inset panels, chips
          border: '#E3E3E8',
          hairline: '#E1E1E0',     // lighter rule inside cards

          ink: '#2A2928',          // primary text
          body: '#44423F',         // long-form body copy
          quote: '#44423F',
          muted: '#615F5D',        // secondary text
          faint: '#8B8B8B',        // labels, eyebrow text
          ghost: '#B0AEAC',        // inactive / disabled
          placeholder: '#8B8B8B',

          accent: '#059669',       // primary action (emerald)
          soft: '#D1FAE5',         // accent tint background
          ring: '#34D399',         // focus + hover border
          wash: '#F0FDF9',         // tinted panel header

          highlight: '#7E22CE',    // secondary CTA (purple)
          'highlight-soft': '#F3E8FF',

          track: '#EDEDF2',        // progress track
          skeleton: '#F1F1EF',
          shimmer: '#E3E3E8',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Source Serif 4', 'Georgia', 'serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-420px 0' },
          '100%': { backgroundPosition: '420px 0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
}
export default config
