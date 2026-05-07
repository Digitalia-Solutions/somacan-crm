/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        somacan: {
          brand: '#033a22',
          50: '#f2f7f4',
          100: '#e0efe6',
          200: '#c3dfc8',
          300: '#96c7a0',
          400: '#62a76e',
          500: '#3d8b4a',
          600: '#2d6f38',
          700: '#25592f',
          800: '#1f4727',
          900: '#1a3b22',
          950: '#0d1f12',
        },
        gold: {
          50: '#fdf9f0',
          100: '#f9f0d8',
          200: '#f2deab',
          300: '#eac87a',
          400: '#e2b24f',
          500: '#d49a2e',
          600: '#b87d22',
          700: '#935f1e',
          800: '#7a4d1e',
          900: '#68401c',
        }
      },
      fontFamily: {
        display: ['Aariana', 'Cormorant Garamond', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'drift': 'drift 11s ease-in-out infinite',
        'ripple': 'ripple 7s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(0, -18px, 0) rotate(-3deg)' },
        },
        ripple: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.35' },
          '50%': { transform: 'scale(1.08)', opacity: '0.6' },
        },
      }
    },
  },
  plugins: [],
}
