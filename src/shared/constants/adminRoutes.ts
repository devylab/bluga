/* eslint-disable @typescript-eslint/no-explicit-any */
export type AdminMenu = {
  id: string;
  to: string;
  name: string;
  path?: string;
  icon: any;
  sidebar: boolean;
  children?: {
    to: string;
    name: string;
    icon: any;
    path: string;
    sidebar: boolean;
  }[];
};

export const adminMenus: AdminMenu[] = [
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
        name: 'Lists',
        icon: '',
        path: '/pages/content/lists.ejs',
        sidebar: true,
      },
      {
        to: '/create',
        name: 'Create',
        icon: '',
        path: '/pages/content/create.ejs',
        sidebar: true,
      },
      {
        to: '/edit/:id',
        name: 'Edit',
        icon: '',
        path: '/pages/content/edit.ejs',
        sidebar: false,
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
    to: '/admin/Settings',
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

export const formatAdminRoutes = (adminMenu: AdminMenu | AdminMenu[]) => {
  let routes: { to: string; path?: string; name: string }[] = [];

  if (Array.isArray(adminMenu)) {
    for (const menu of adminMenu) {
      if (menu?.children?.length) {
        const nestedMenus = menu.children.map((nestedMenu) => ({
          to: menu.to + nestedMenu.to,
          path: nestedMenu.path,
          name: nestedMenu.name,
        }));
        routes = [...routes, ...nestedMenus];
      } else {
        routes.push({ to: menu.to, path: menu.path, name: menu.name });
      }
    }
  } else {
    if (adminMenu?.children?.length) {
      const nestedMenus = adminMenu.children.map((nestedMenu) => ({
        to: adminMenu.to + nestedMenu.to,
        path: nestedMenu.path,
        name: nestedMenu.name,
      }));
      routes = [...routes, ...nestedMenus];
    } else {
      routes.push({ to: adminMenu.to, path: adminMenu.path, name: adminMenu.name });
    }
  }

  return routes;
};
