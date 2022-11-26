/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/admin/**/*.{hbs,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'main-light': '#fafbfb',
        'main-dark': '#20232A',
        'sidebar-dark': '#282C34',
        'sidebar-light': '#ffffff',
      },
    },
  },
  plugins: [],
};
