import { ReactNode } from 'react';
import { ProSidebarProvider, useProSidebar } from 'react-pro-sidebar';
import Sidebar from '@admin/components/sidebar/Sidebar';
import Settings from '@admin/components/settings/Settings';
import Navbar from '@admin/components/navbar/Navbar';
import { Box, styled, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { ThemeContext, useMode } from '@admin/context/ThemeContext';

type DashboardLayout = {
  children?: ReactNode;
};

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const Layout = ({ children }: DashboardLayout) => {
  const { collapseSidebar, collapsed } = useProSidebar();

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Settings />
      <Sidebar />
      <Box width="100%">
        <Navbar open={collapsed} toggleSidebar={collapseSidebar} drawerWidth={drawerWidth} />
        <Main>
          <div> hello{children}</div>
        </Main>
      </Box>
    </Box>
  );
};

const Dashboard = ({ children }: DashboardLayout) => {
  const { theme, setTheme } = useMode();

  return (
    <ThemeContext.Provider value={setTheme}>
      <MUIThemeProvider theme={theme}>
        <ProSidebarProvider>
          <Layout>{children}</Layout>
        </ProSidebarProvider>
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default Dashboard;
