/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/admin/**/*.{ejs,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sidebar-link-dark': '#7B7B7B',
        'main-light': '#FAFBFB',
        'main-dark': '#1C1C1C',
        'sidebar-dark': '#1E1E1E',
        'sidebar-light': '#ffffff',
        green: '#BBF400',
      },
    },
  },
  plugins: [],
};
