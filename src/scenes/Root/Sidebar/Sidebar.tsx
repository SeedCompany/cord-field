import { FolderOpen, Language, Person } from '@mui/icons-material';
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  SvgIconProps,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ComponentType } from 'react';
import { extendSx, StyleProps } from '~/common';
import { PeopleJoinedIcon } from '../../../components/Icons';
import { ListItemLink, ListItemLinkProps } from '../../../components/Routing';
import { CreateButtonMenu } from '../Creates';
import { sidebarTheme } from './sidebar.theme';
import { SidebarHeader } from './SidebarHeader';

export const Sidebar = ({ sx }: StyleProps) => {
  const navList = (
    <List
      component="nav"
      aria-label="sidebar"
      subheader={<ListSubheader component="div">MENU</ListSubheader>}
    >
      <NavItem to="/projects" label="Projects" icon={FolderOpen} />
      <NavItem to="/languages" label="Languages" icon={Language} />
      <NavItem to="/users" label="People" icon={Person} />
      <NavItem to="/partners" label="Partners" icon={PeopleJoinedIcon} />
    </List>
  );

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
        <Box sx={{ py: 0, px: 2 }}>
          <CreateButtonMenu
            fullWidth
            sx={(theme) => ({
              m: theme.spacing(4, 2, 1),
              width: `calc(100% - ${theme.spacing(2 * 2)})`,
            })}
          />
          {navList}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

const NavItem = ({
  icon: Icon,
  label,
  ...props
}: ListItemLinkProps & {
  icon: ComponentType<SvgIconProps>;
  label: string;
}) => (
  <ListItemLink {...props}>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText>{label}</ListItemText>
  </ListItemLink>
);
