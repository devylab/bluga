import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import { FiAlignLeft } from 'react-icons/fi';

type Navbar = {
  open: boolean;
  toggleSidebar: () => void;
  drawerWidth: number;
};

type AppBarProps = MuiAppBarProps & {
  open?: boolean;
  drawerwidth: number;
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, drawerwidth }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerwidth}px)`,
    marginLeft: `${drawerwidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Navbar = ({ open, toggleSidebar, drawerWidth }: Navbar) => {
  return (
    <AppBar position="fixed" open={open} drawerwidth={drawerWidth}>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" onClick={toggleSidebar} edge="start" sx={{ mr: 2 }}>
          <FiAlignLeft />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Persistent drawer
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
