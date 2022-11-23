import { useAppTheme } from '@admin/hooks/useAppTheme';
import { AppBar as MuiAppBar, AppBarProps as MuiAppBarProps, Box, IconButton, InputBase, styled } from '@mui/material';
import { FiAlignLeft, FiBell, FiSearch, FiSettings } from 'react-icons/fi';

type Navbar = {
  open: boolean;
  toggleSidebar: () => void;
  drawerWidth: number;
};

type AppBarProps = MuiAppBarProps & {
  open?: boolean;
  drawerwidth?: number;
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, drawerwidth }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: '100%',
}));

const Navbar = ({ open, toggleSidebar, drawerWidth }: Navbar) => {
  const appTheme = useAppTheme();

  return (
    <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" p={3}>
      <IconButton color="inherit" aria-label="open drawer" onClick={() => toggleSidebar()} edge="start" sx={{ mr: 2 }}>
        <FiAlignLeft />
      </IconButton>

      <Box display="flex" sx={{ backgroundColor: appTheme.primary[400] }} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <FiSearch />
        </IconButton>
      </Box>

      <Box display="flex">
        <IconButton type="button" sx={{ p: 1 }}>
          <FiBell />
          <FiSettings />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Navbar;
