/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/admin/**/*.{ejs,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'main-light': '#FAFBFB',
        'main-dark': '#1C1C1C',
        'sidebar-dark': '#141414',
        'sidebar-light': '#ffffff',
        green: '#BBF400',
      },
    },
  },
  plugins: [],
};
