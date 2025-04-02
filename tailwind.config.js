/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef1f5',
          100: '#fde6ed',
          200: '#fcd5e3',
          300: '#f7c8d6',
          400: '#f5a8c0',
          500: '#f182a4',
          600: '#e45c88',
          700: '#d43a6f',
          800: '#c02a5a',
          900: '#a41e47',
        },
        secondary: {
          50: '#f2f2f2',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#000000',
        },
        gold: {
          100: '#f7f3e3',
          200: '#f0e7c7',
          300: '#e8dba9',
          400: '#e1cf8b',
          500: '#d9c36d',
          600: '#d4af37',
          700: '#c49f32',
          800: '#b48f2d',
          900: '#a47f28',
        },
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
