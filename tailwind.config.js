/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#FDF7F8',
          100: '#FBECEF',
          200: '#F7D6DC',
          300: '#EEB1BD',
          400: '#DE7E95',
          500: '#C74F6E',
          600: '#AC3353',
          700: '#8A233F',
          800: '#641B2F',
          900: '#431220',
          950: '#270811',
        },
        wine: {
          50: '#FAF5F6',
          100: '#F4E9EB',
          200: '#EBD4D8',
          300: '#DBB0B8',
          400: '#C48391',
          500: '#A9586B',
          600: '#8C3D51',
          700: '#6E2A3B',
          800: '#4F1B28',
          900: '#35101A',
          950: '#1F060E',
        },
        blush: {
          50: '#FFF9FA',
          100: '#FFF0F3',
          200: '#FFE2E8',
          300: '#FFCAD6',
          400: '#FFA3B8',
          500: '#F67394',
          600: '#E04770',
          700: '#BD2E55',
          800: '#9B2444',
          900: '#7C1F37',
        },
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F1',
          200: '#F4EFE3',
          300: '#ECE2CF',
          400: '#DFCFB4',
          500: '#CCB694',
          600: '#B09673',
          700: '#8C7456',
          800: '#66533C',
          900: '#443627',
        },
        gold: {
          50: '#FCF9EE',
          100: '#F7F0D4',
          200: '#EFE0A8',
          300: '#E4CC76',
          400: '#D7B447',
          500: '#C29A2B',
          600: '#9F771F',
          700: '#7A571A',
          800: '#5A3F17',
          900: '#3D2A11',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
