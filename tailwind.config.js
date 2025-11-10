/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ['"PP Neue Montreal"', "sans-serif"],
      },
      colors: {
        'text-custom': 'rgba(245,245,245,0.9)'
      },
      keyframes: {
        expandDot: {
          '0%': { width: '4px', height: '4px', opacity: '1' },
          '100%': { width: '20px', height: '20px', opacity: '0' }
        }
      },
      animation: {
        expandDot: 'expandDot 2s ease-out infinite'
      }
    }
  },
  plugins: [],
}
