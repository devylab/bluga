/** @type {import('@src/shared/interfaces/adminRoute.interface').AdminMenu[]} */

export const adminMenus = [
  {
    id: '1',
    to: '/admin',
    name: 'Overview',
    path: '/pages/overview.ejs',
    icon: '',
    sidebar: true,
  },
  {
    id: '2',
    to: '/admin/contents',
    name: 'Contents',
    icon: '',
    sidebar: true,
    children: [
      {
        to: '/lists',
        name: 'Content Lists',
        icon: '',
        path: '/pages/content/lists.ejs',
        sidebar: true,
      },
      {
        to: '/create',
        name: 'Content Create',
        icon: '',
        path: '/pages/content/create.ejs',
        sidebar: true,
        header: ['/public/styles/content.css'],
        footer: ['https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest', '/public/scripts/save.min.js'],
      },
      {
        to: '/edit/:id',
        name: 'Content Edit',
        icon: '',
        path: '/pages/content/edit.ejs',
        sidebar: false,
        header: ['/public/styles/content.css'],
        footer: ['https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest', '/public/scripts/save.min.js'],
      },
    ],
  },
  {
    id: '3',
    to: '/admin/themes',
    name: 'Themes',
    icon: '',
    path: '/pages/themes.ejs',
    sidebar: true,
  },
  {
    id: '4',
    to: '/admin/settings',
    name: 'Settings',
    icon: '',
    sidebar: true,
    children: [
      {
        to: '/general',
        name: 'General',
        icon: '',
        path: '/pages/settings/general.ejs',
        sidebar: true,
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
