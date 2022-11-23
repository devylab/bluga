import { createContext, useMemo, useState } from 'react';
import { ThemeMode, themeSettings } from '@admin/config/theme';

type ThemeContext = {
  setTheme: (theme: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContext>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setTheme: (_theme) => {},
});

export const useMode = () => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const setTheme = useMemo(
    () => ({
      setTheme: (theme: ThemeMode) => setMode(theme),
    }),
    [],
  );

  const theme = useMemo(() => themeSettings(mode), [mode]);

  return { theme, setTheme };
};
