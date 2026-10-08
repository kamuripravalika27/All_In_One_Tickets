/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A192F',     // Navy Blue
          navy: '#0F2942',     // Deep Navy
          blue: '#1E3A8A',     // Primary Blue
          sky: '#0EA5E9',      // Sky Blue Accent
          lightSky: '#E0F2FE', // Light Sky Tint
          gold: '#F59E0B'      // Accent Gold
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(15, 41, 66, 0.1)',
        glow: '0 0 20px rgba(14, 165, 233, 0.35)',
      }
    },
  },
  plugins: [],
}
