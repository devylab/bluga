/** @type {import('@types/themeConfig').ThemeConfig} */
module.exports = [
  {
    route: '/',
    path: '/pages/index.ejs',
  },
  {
    route: '/:slug',
    path: '/pages/single.ejs',
  },
];
