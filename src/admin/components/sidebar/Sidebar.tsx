/* eslint-disable max-lines-per-function */
import { styled } from '@mui/material';
import { clsx } from 'clsx';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { AdminMenu } from '@shared/constants/adminRoutes';
import { Utils } from '@shared/utils';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Link from 'next/link';

const { adminRoutes } = Utils.renderAdminRoutes();

type Sidebar = {
  open: boolean;
  drawerWidth: number;
};

const StyledSidebar = styled(Sidebar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,

  '.sidebar-inner': {
    backgroundColor: 'transparent',
  },
}));

const SidebarSubMenu = styled(SubMenu)(({ theme }) => ({
  '&.active > a': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },

  '.sub-active': {
    color: theme.palette.primary.main,
  },
}));

const SidebarMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.active a': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const DashSidebar = () => {
  const [adminMenus, setAdminMenus] = useState<AdminMenu[]>([]);
  const { pathname } = useRouter();
  // const isActive = exact ? pathname === menu.to : pathname.startsWith(menu.to.toString());

  useEffect(() => {
    adminRoutes.subscribe((routes) => setAdminMenus(routes));
  }, [adminMenus]);

  return (
    <StyledSidebar>
      <PerfectScrollbar>
        <Menu>
          {adminMenus.map((adminMenu) => (
            <Fragment key={adminMenu.to}>
              {adminMenu?.children ? (
                <SidebarSubMenu
                  label={adminMenu.name}
                  className={clsx({
                    active: pathname.startsWith(adminMenu.to),
                  })}
                >
                  {adminMenu?.children?.map((childMenu) => (
                    <MenuItem
                      className={clsx({
                        'sub-active': pathname === adminMenu.to + childMenu.to,
                      })}
                      key={adminMenu.to + childMenu.to}
                      routerLink={<Link href={adminMenu.to + childMenu.to} />}
                    >
                      {childMenu.name}
                    </MenuItem>
                  ))}
                </SidebarSubMenu>
              ) : (
                <SidebarMenuItem
                  className={clsx({ active: pathname === adminMenu.to })}
                  routerLink={<Link href={adminMenu.to} />}
                >
                  {adminMenu.name}
                </SidebarMenuItem>
              )}
            </Fragment>
          ))}
        </Menu>
      </PerfectScrollbar>
    </StyledSidebar>
  );
};

export default DashSidebar;
