import { ListSubheader, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { extendSx, StyleProps } from '~/common';
import { RootNavList } from '../RootNavList';
import { sidebarTheme } from './sidebar.theme';
import { SidebarHeader } from './SidebarHeader';

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
          },
          ...extendSx(sx),
        ]}
      >
        <SidebarHeader />
        <RootNavList
          subheader={<ListSubheader component="div">MENU</ListSubheader>}
        />
      </Paper>
    </ThemeProvider>
  );
};
