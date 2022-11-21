import { Theme } from '@mui/material';
import { createContext, ReactNode, useEffect, useState } from 'react';
import themes, { themeTypes } from '@admin/config/theme';

type ThemeContext = {
  theme: Theme;
  setTheme: (theme: themeTypes) => void;
};

export const ThemeContext = createContext<ThemeContext>({
  theme: themes.defaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setTheme: (_theme) => {},
});

type ThemeProvider = {
  children?: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProvider) => {
  const storageName = 'app-theme';
  const [currentTheme, setCurrentTheme] = useState<themeTypes>('defaultTheme');

  useEffect(() => {
    const selectedTheme = (window.localStorage.getItem(storageName) as themeTypes) || 'defaultTheme';
    setCurrentTheme(selectedTheme);
  }, []);

  const setTheme = (theme: themeTypes) => {
    setCurrentTheme(theme);
    window.localStorage.setItem(storageName, theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[currentTheme],
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
