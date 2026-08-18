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
         * Clay — the light editorial palette used by the authenticated app.
         * Semantic names, so a future palette swap is a one-file edit.
         */
        clay: {
          paper: '#F3EFE8',      // page background
          shell: '#FAF7F2',      // recessed surfaces: inputs, inset panels
          surface: '#FFFFFF',    // cards and raised panels
          border: '#E6DFD5',
          ink: '#1A1613',        // primary text
          body: '#3D362F',       // long-form body copy
          quote: '#4A423A',      // pull quotes
          muted: '#6B6157',      // secondary text
          faint: '#8A7F73',      // labels, eyebrow text
          ghost: '#B4A99C',      // inactive / disabled
          placeholder: '#A69A8C',
          accent: '#C2542F',     // primary action
          soft: '#F6E7DF',       // accent tint background
          ring: '#DC9A80',       // accent border / focus
          wash: '#FDF6F1',       // tinted panel header
          track: '#EFE4DA',      // progress track
          skeleton: '#F4EDE5',
          shimmer: '#EAE0D5',
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
