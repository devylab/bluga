/* eslint-disable max-lines-per-function */
import { Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { FiBarChart } from 'react-icons/fi';
import PerfectScrollbar from 'react-perfect-scrollbar';

type Sidebar = {
  open: boolean;
  drawerWidth: number;
};

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'center',
}));

const SidebarMenu = styled(List)`
  margin: 0px 10px;
  overflow: hidden;
`;

const SidebarMenuItem = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '50px',
  borderRadius: '10px',
  textDecoration: 'none',
  padding: '5px 10px',
  marginBottom: '10px',

  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },

  '&.active svg': {
    color: theme.palette.primary.contrastText,
  },

  '> .MuiListItemIcon-root': {
    minWidth: '30px',
  },
}));

const SidebarMenuItemCollapse = styled(Collapse)(({ theme }) => ({
  '& .sub-active': {
    color: theme.palette.primary.main,
  },
}));

type Menu = {
  id: string;
  to: string;
  name: string;
  children?: {
    to: string;
    name: string;
  }[];
};

const menus = [
  {
    id: '1',
    to: '/admin',
    name: 'Dashboard',
  },
  {
    id: '2',
    to: '/admin/contents',
    name: 'Contents',
    children: [
      {
        to: '/lists',
        name: 'Lists',
      },
      {
        to: '/create',
        name: 'Create',
      },
    ],
  },
  {
    id: '3',
    to: '#',
    name: 'Fiona',
    children: [
      {
        to: '/admin/dashboard',
        name: 'Great',
      },
    ],
  },
];

type SidebarMenuList = {
  exact?: boolean;
  menu: Menu;
  handleRoute: (menu: Menu, to: string, currentMenuId?: string) => void;
  currentMenu: string;
};

const SidebarMenuList = ({ exact, handleRoute, menu, currentMenu }: SidebarMenuList) => {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === menu.to : pathname.startsWith(menu.to.toString());

  return (
    <Fragment>
      <SidebarMenuItem className={isActive ? 'active' : ''} onClick={() => handleRoute(menu, menu.to, menu.id)}>
        <ListItemIcon>
          <FiBarChart />
        </ListItemIcon>
        <ListItemText primary={menu.name} />
        {menu.children && (currentMenu === menu.id ? 'l' : 'm')}
      </SidebarMenuItem>
      {menu.children && (
        <SidebarMenuItemCollapse in={currentMenu === menu.id} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menu.children?.map((child) => (
              <ListItemButton
                className={pathname === menu.to + child.to ? 'sub-active' : ''}
                key={child.name}
                onClick={() => handleRoute(menu, child.to)}
                sx={{ pl: 4 }}
              >
                <ListItemText primary={child.name} />
              </ListItemButton>
            ))}
          </List>
        </SidebarMenuItemCollapse>
      )}
    </Fragment>
  );
};

const Sidebar = ({ open, drawerWidth }: Sidebar) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState('');

  const handleClick = (menu: Menu, to: string, menuId?: string) => {
    if (!menu.children) {
      router.push(to);
      setCurrentMenu(menuId || '');
    } else if (menuId) setCurrentMenu(menuId);
    else router.push(menu.to + to);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <PerfectScrollbar>
        <DrawerHeader>
          <h3>ContentQuery</h3>
        </DrawerHeader>

        <SidebarMenu>
          {menus.map((menu) => (
            <SidebarMenuList
              key={menu.id}
              exact={!menu.children}
              handleRoute={handleClick}
              menu={menu}
              currentMenu={currentMenu}
            />
          ))}
        </SidebarMenu>
      </PerfectScrollbar>
    </Drawer>
  );
};

export default Sidebar;
