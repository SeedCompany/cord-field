import { Box, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { sidebarTheme } from './sidebar.theme';
import { SidebarContent } from './SidebarContent';

export const SIDEBAR_WIDTH = 248;

export interface SidebarProps {
  /** Whether the sidebar is expanded. When false, collapses to zero width. */
  open: boolean;
}

// React 18's HTMLAttributes don't yet declare `inert`; the DOM accepts it as
// a boolean attribute (presence = true). Spread an extra-attributes record so
// we don't widen the JSX type globally.
const inertProps: Record<string, unknown> = { inert: '' };
const noProps: Record<string, unknown> = {};

/**
 * Desktop sidebar — rendered inline in the main layout (md and up).
 * Width animates between 0 and `SIDEBAR_WIDTH` so the main content area
 * naturally reflows when toggled. Hidden entirely below `md`; mobile users
 * get a temporary drawer instead (see MainLayout).
 */
export const Sidebar = ({ open }: SidebarProps) => (
  <ThemeProvider theme={sidebarTheme}>
    <Paper
      elevation={0}
      square
      // When collapsed, `inert` removes the subtree from the tab order and
      // accessibility tree, preventing keyboard focus on invisible controls.
      {...(open ? noProps : inertProps)}
      sx={{
        flexShrink: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        width: open ? SIDEBAR_WIDTH : 0,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        display: { xs: 'none', md: 'block' },
      }}
    >
      {/* Inner box keeps content at full width so it doesn't reflow during the collapse animation. */}
      <Box sx={{ width: SIDEBAR_WIDTH }}>
        <SidebarContent />
      </Box>
    </Paper>
  </ThemeProvider>
);
