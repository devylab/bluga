/* eslint-disable @typescript-eslint/no-explicit-any */
export type AdminMenu = {
  id: string;
  to: string;
  name: string;
  icon: any;
  children?: {
    to: string;
    name: string;
    icon: any;
  }[];
};

export const adminMenus: AdminMenu[] = [
  {
    id: '1',
    to: '/admin',
    name: 'Overview',
    icon: '',
  },
  {
    id: '2',
    to: '/admin/contents',
    name: 'Contents',
    icon: '',
    children: [
      {
        to: '/lists',
        name: 'Lists',
        icon: '',
      },
      {
        to: '/create',
        name: 'Create',
        icon: '',
      },
    ],
  },
  {
    id: '3',
    to: '/admin/Settings',
    name: 'Settings',
    icon: '',
    children: [
      {
        to: '/general',
        name: 'General',
        icon: '',
      },
    ],
  },
];

export const formatAdminRoutes = (adminMenu: AdminMenu | AdminMenu[]) => {
  let routes: string[] = [];

  if (Array.isArray(adminMenu)) {
    for (const menu of adminMenu) {
      if (menu?.children?.length) {
        const nestedMenus = menu.children.map((nestedMenu) => menu.to + nestedMenu.to);
        routes = [...routes, ...nestedMenus];
      } else {
        routes.push(menu.to);
      }
    }
  } else {
    if (adminMenu?.children?.length) {
      const nestedMenus = adminMenu.children.map((nestedMenu) => adminMenu.to + nestedMenu.to);
      routes = [...routes, ...nestedMenus];
    } else {
      routes.push(adminMenu.to);
    }
  }

  return routes;
};
