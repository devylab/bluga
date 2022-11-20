import { ReactNode } from 'react';
import { FiSettings } from 'react-icons/fi';
import { IconButton, Tooltip } from '@mui/material';
import Sidebar from '@admin/components/sidebar/Sidebar';

type DashboardLayout = {
  children?: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayout) => {
  const activeMenu = false;

  return (
    <div>
      <div>
        <Tooltip title="Setting">
          <IconButton>
            <FiSettings />
          </IconButton>
        </Tooltip>
      </div>
      <Sidebar active={activeMenu} />
      <div>
        <div>Navbars</div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
