/** @type {import('@types/themeConfig').ThemeConfig} */
module.exports = [
  {
    route: '/',
    path: '/pages/index.ejs',
    title: '{{name}}',
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
    title: '{{content.title}} - {{name}}',
    queries: [
      {
        name: 'content',
        query: (self) => self.content.getContentBySlug(self.params.slug),
      },
    ],
  },
];
