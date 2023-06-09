import { Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { extendSx, StyleProps } from '~/common';
import { sidebarTheme } from './sidebar.theme';
import { SidebarDrawer } from './SidebarDrawer';

export const Sidebar = ({ sx }: StyleProps) => {
  return (
    <ThemeProvider theme={sidebarTheme}>
      <Paper
        elevation={0}
        square
        sx={[
          {
            maxWidth: 248,
            overflowY: 'auto',
            zIndex: 999,
            backgroundColor: 'white',
          },
          ...extendSx(sx),
        ]}
      >
        {/* <SidebarHeader /> */}
        {/* <RootNavList
          subheader={<ListSubheader component="div">MENU</ListSubheader>}
        /> */}
        <SidebarDrawer />
      </Paper>
    </ThemeProvider>
  );
};
