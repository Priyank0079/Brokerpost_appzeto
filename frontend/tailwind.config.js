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
          50: '#F9F6EF',
          100: '#F2ECD9',
          200: '#E6D8B3',
          300: '#D9C48D',
          400: '#CCB167',
          500: '#C59D3F',
          600: '#B08A35',
          700: '#91712C',
          800: '#725922',
          900: '#534119',
          950: '#342910',
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
