import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { type ReactNode, useMemo } from 'react';
import { createTheme } from './createTheme';

export const ThemeProvider = ({ children }: { children?: ReactNode }) => {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });

  const theme = useMemo(() => createTheme({ dark: isDark }), [isDark]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
};
