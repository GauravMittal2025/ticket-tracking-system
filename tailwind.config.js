/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f9',
          100: '#dce7f3',
          200: '#bfd1e7',
          300: '#93b2d8',
          400: '#6490c7',
          500: '#4173b6',
          600: '#1A365D', // primary color
          700: '#142b4c',
          800: '#0F2942',
          900: '#0c1e33',
        },
        secondary: {
          50: '#e6f7f6',
          100: '#ccf0ed',
          200: '#99e0db',
          300: '#66d1c8',
          400: '#33c1b6',
          500: '#0D9488', // secondary color
          600: '#0a7a70',
          700: '#086158',
          800: '#054740',
          900: '#032e28',
        },
        accent: {
          50: '#fef4ed',
          100: '#fde8db',
          200: '#fbd2b6',
          300: '#f9bb92',
          400: '#f7a56d',
          500: '#F97316', // accent color
          600: '#c75c12',
          700: '#95450d',
          800: '#632e09',
          900: '#321704',
        }
      }
    },
  },
  plugins: [],
};