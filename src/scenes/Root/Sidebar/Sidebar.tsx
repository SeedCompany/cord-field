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
// we don't have to widen the JSX type globally.
const openProps: Record<string, unknown> = {};
// Always emit `inert` so SSR and client markup stay aligned. Browsers that
// don't support it simply ignore the attribute.
const closedProps: Record<string, unknown> = { inert: '', 'aria-hidden': true };

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
      // `inert` blocks focus/AT in modern browsers; visibility/pointer-events
      // preserve equivalent behavior for older browsers.
      {...(open ? openProps : closedProps)}
      sx={{
        flexShrink: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        // Keep content visible during width collapse; switch to hidden at
        // the end of the close animation to avoid an empty panel slide.
        visibility: open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        width: open ? SIDEBAR_WIDTH : 0,
        transition: (theme) => {
          const duration = open
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen;
          const widthTransition = theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration,
          });
          const visibilityDelay = open ? 0 : duration;

          return `${widthTransition}, visibility 0s linear ${visibilityDelay}ms`;
        },
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
