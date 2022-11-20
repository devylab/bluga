import { Divider, Drawer, styled } from '@mui/material';

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
  justifyContent: 'flex-end',
}));

const Sidebar = ({ open, drawerWidth }: Sidebar) => {
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
      <DrawerHeader>
        <h3>ContentQuery</h3>
      </DrawerHeader>
      <Divider />
      <p>hello</p>
    </Drawer>
  );
};

export default Sidebar;
