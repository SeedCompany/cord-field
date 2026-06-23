import { useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';

/**
 * Whether the viewport is at or below the given breakpoint (default `md`, i.e.
 * < 900px). Used to switch the app into its mobile layout — collapsing the
 * sidebar into a drawer, rendering grids as dense lists, full-screen dialogs, etc.
 */
export const useIsMobile = (breakpoint: Breakpoint = 'md') => {
  const theme = useTheme();
  // `noSsr` reads matchMedia on the first client render (the app uses
  // `createRoot`, not hydration), so mobile shows the mobile layout immediately
  // instead of briefly rendering the desktop view — e.g. a wide DataGrid that
  // horizontally overflows — before the media query resolves.
  return useMediaQuery(theme.breakpoints.down(breakpoint), { noSsr: true });
};
