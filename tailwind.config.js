/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#E9DDC7',
          light: '#F4EBDD',
          dark: '#DACAB0',
          tint: '#F9F4EB'
        },
        ivory: '#F4EBDD',
        olive: {
          DEFAULT: '#626B50',
          light: '#7A8466',
          dark: '#4C543E',
        },
        forest: {
          DEFAULT: '#26352D',
          deep: '#1C2822',
          light: '#35473E',
        },
        charcoal: {
          DEFAULT: '#292B27',
          dark: '#1E201D',
          light: '#3D403A',
        },
        vintage: {
          brown: '#89634C',
          copper: '#B17B53',
          rust: '#9E4732',
          amber: '#D49B55',
          gold: '#C59E60',
        },
        brand: {
          primary: '#0E1F21',
          secondary: '#6A8E8B',
          tertiary: '#D9E3E1',
          'text-primary': '#1A2A2D',
          'text-secondary': '#6B7B7D',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        editorial: ['"Playfair Display"', '"Space Grotesk"', 'serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '0.9rem' }],
        '3xs': ['0.55rem', { lineHeight: '0.75rem' }],
      },
      letterSpacing: {
        'ultra-wide': '0.25em',
        'mega-wide': '0.35em',
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin-reverse 45s linear infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'radar-ping': 'radarPing 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        radarPing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '70%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      }
    },
  },
  plugins: [],
}
