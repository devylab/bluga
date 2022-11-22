import { tokens } from '@admin/config/theme';
import { useTheme } from '@mui/material';

export const useAppTheme = () => {
  const theme = useTheme();
  return tokens(theme.palette.mode);
};
