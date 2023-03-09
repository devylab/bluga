/** @type {import('@types/themeConfig').ThemeConfig} */
module.exports = [
  {
    route: '/',
    path: '/pages/index.ejs',
    queries: [
      {
        name: 'contents',
        query: (self) => self.content.getContents('DRAFT'),
      },
    ],
  },
  {
    route: '/:slug',
    path: '/pages/single.ejs',
    queries: [
      {
        name: 'content',
        query: (self) => self.content.getContentBySlug(self.params.slug),
      },
    ],
  },
];
