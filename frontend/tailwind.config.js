/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F9F7EF',
          100: '#F1EBD8',
          200: '#E5D6B1',
          300: '#D8C28A',
          400: '#CDAC63',
          500: '#c8962a',
          600: '#b08425',
          700: '#906d1e',
          800: '#715518',
          900: '#523e11',
          950: '#33270b',
        },
        sidebar: '#0F172A',
        background: '#F8FAFC',
        success: '#22C55E',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
