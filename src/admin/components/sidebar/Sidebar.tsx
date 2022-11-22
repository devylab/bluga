/* eslint-disable max-lines-per-function */
import { Collapse, Drawer, List, ListItemButton, ListItemIcon, ListItemText, styled } from '@mui/material';
import { AdminMenu } from '@shared/constants/adminRoutes';
import { Utils } from '@shared/utils';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import PerfectScrollbar from 'react-perfect-scrollbar';

const { adminRoutes } = Utils.renderAdminRoutes();

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
  height: '50px',
  borderRadius: '10px',
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

const SidebarSubMenuItem = styled(ListItemButton)(({ theme }) => ({
  height: '50px',
  borderRadius: '10px',

  '&.sub-active': {
    color: theme.palette.primary.main,
  },

  '&.sub-active svg': {
    color: theme.palette.primary.main,
  },

  '> .MuiListItemIcon-root': {
    minWidth: '30px',
  },
}));

type SidebarMenuList = {
  exact?: boolean;
  menu: AdminMenu;
  handleRoute: (menu: AdminMenu, to: string, currentMenuId?: string) => void;
  currentMenu: string;
};

const SidebarMenuList = ({ exact, handleRoute, menu, currentMenu }: SidebarMenuList) => {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === menu.to : pathname.startsWith(menu.to.toString());

  return (
    <Fragment>
      <SidebarMenuItem className={isActive ? 'active' : ''} onClick={() => handleRoute(menu, menu.to, menu.id)}>
        <ListItemIcon>{menu.icon}</ListItemIcon>
        <ListItemText primary={menu.name} />
        {menu.children && (currentMenu === menu.id ? <FiChevronDown /> : <FiChevronRight />)}
      </SidebarMenuItem>
      {menu.children && (
        <Collapse in={currentMenu === menu.id} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menu.children?.map((child) => (
              <SidebarSubMenuItem
                className={pathname === menu.to + child.to ? 'sub-active' : ''}
                key={child.name}
                onClick={() => handleRoute(menu, child.to)}
                sx={{ pl: 4 }}
              >
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={child.name} />
              </SidebarSubMenuItem>
            ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
};

const Sidebar = ({ open, drawerWidth }: Sidebar) => {
  const router = useRouter();
  const [currentMenu, setCurrentMenu] = useState('');
  const [adminMenus, setAdminMenus] = useState<AdminMenu[]>([]);

  useEffect(() => {
    adminRoutes.subscribe((routes) => setAdminMenus(routes));
  }, [adminMenus]);

  const handleClick = (menu: AdminMenu, to: string, menuId?: string) => {
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
          {adminMenus.map((menu) => (
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
