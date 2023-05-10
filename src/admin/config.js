/** @type {import('@src/shared/interfaces/adminRoute.interface').AdminMenu[]} */
const adminMenus = [
  {
    id: '1',
    to: '/admin',
    name: 'Overview',
    path: '/pages/overview.ejs',
    icon: 'fas fa-tachometer-alt',
    sidebar: true,
  },
  {
    id: '2',
    to: '/admin/contents',
    name: 'Contents',
    icon: 'fas fa-blog',
    sidebar: true,
    children: [
      {
        to: '/lists',
        name: 'Lists',
        icon: '',
        path: '/pages/content/lists.ejs',
        sidebar: true,
        footer: ['/public/scripts/lists.min.js'],
      },
      {
        to: '/create',
        name: 'Create',
        icon: '',
        path: '/pages/content/create.ejs',
        sidebar: true,
        header: ['/public/styles/content.css'],
        footer: [
          'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.26.5',
          'https://cdn.jsdelivr.net/npm/@editorjs/image@2.3.0',
          'https://cdn.jsdelivr.net/npm/@editorjs/attaches@1.3.0',
          '/public/scripts/save.min.js',
        ],
      },
      {
        to: '/edit/:id',
        name: 'Content Edit',
        icon: '',
        path: '/pages/content/create.ejs',
        sidebar: false,
        header: ['/public/styles/content.css'],
        footer: [
          'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.26.5',
          'https://cdn.jsdelivr.net/npm/@editorjs/image@2.3.0',
          'https://cdn.jsdelivr.net/npm/@editorjs/attaches@1.3.0',
          '/public/scripts/save.min.js',
        ],
      },
    ],
  },
  {
    id: '3',
    to: '/admin/themes',
    name: 'Themes',
    icon: 'fas fa-palette',
    path: '/pages/themes.ejs',
    sidebar: true,
  },
  {
    id: '4',
    to: '/admin/settings',
    name: 'Settings',
    icon: 'fas fa-tools',
    sidebar: true,
    children: [
      {
        to: '/general',
        name: 'General Settings',
        icon: '',
        path: '/pages/settings/general.ejs',
        sidebar: true,
        header: ['/public/styles/settings.css'],
        footer: [
          '/public/plugins/bs-custom-file-input/bs-custom-file-input.min.js',
          '/public/scripts/general.min.js',
          '/public/scripts/settings.min.js',
        ],
      },
    ],
  },
  {
    id: '5',
    to: '/admin/login',
    name: 'Login',
    icon: '',
    path: '/pages/login.ejs',
    sidebar: false,
  },
];

module.exports = { adminMenus };
