import { ThemeContext } from '@admin/context/ThemeContext';
import { Box, Button, Drawer, IconButton, styled, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import { FiSettings } from 'react-icons/fi';

const SettingsWrapper = styled(Box)`
  position: fixed;
  bottom: 30px;
  right: 30px;
`;

const Settings = () => {
  const { setTheme } = useContext(ThemeContext);
  const [active, setActive] = useState(false);

  const closeSettings = () => setActive(false);
  const openSettings = () => setActive(true);

  return (
    <>
      <SettingsWrapper>
        <Tooltip title="Settings">
          <IconButton color="primary" onClick={openSettings}>
            <FiSettings />
          </IconButton>
        </Tooltip>
      </SettingsWrapper>
      <Drawer anchor="right" open={active} onClose={closeSettings}>
        <div>Settings Page</div>

        <Button onClick={() => setTheme('dark')}>Dark</Button>
        <Button onClick={() => setTheme('light')}>Light</Button>
      </Drawer>
    </>
  );
};

export default Settings;
