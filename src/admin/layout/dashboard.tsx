import { ReactNode, useState } from 'react';
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
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DashboardLayout = ({ children }: DashboardLayout) => {
  const { theme, setTheme } = useMode();
  const [sidebarActive, setSidebarActive] = useState(true);
  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  return (
    <ThemeContext.Provider value={setTheme}>
      <MUIThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <Settings />
          <Sidebar open={sidebarActive} drawerWidth={drawerWidth} />
          <Main open={sidebarActive}>
            <Navbar open={sidebarActive} toggleSidebar={toggleSidebar} drawerWidth={drawerWidth} />
            <div> hello{children}</div>
          </Main>
        </Box>
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default DashboardLayout;
