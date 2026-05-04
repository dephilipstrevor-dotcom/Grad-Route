/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          copper: '#E05D36',
          dark: '#0A0F1C',
          panel: '#111827',
          slate: '#0F172A'
        }
      }
    },
  },
  plugins: [],
}