import { Dashboard, FolderOpen, Language, Person } from '@mui/icons-material';
import {
  List,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  SvgIconProps,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ComponentType } from 'react';
import { makeStyles } from 'tss-react/mui';
import { PeopleJoinedIcon } from '../../../components/Icons';
import { ListItemLink, ListItemLinkProps } from '../../../components/Routing';
import { CreateButtonMenu } from '../Creates';
import { sidebarTheme } from './sidebar.theme';
import { SidebarHeader } from './SidebarHeader';

const useStyles = makeStyles()(({ spacing }) => ({
  root: {
    width: 248,
    overflowY: 'auto',
    flexShrink: 0,
  },
  content: {
    padding: spacing(0, 2),
  },
  createNewItem: {
    margin: spacing(4, 2, 1),
    width: `calc(100% - ${spacing(2 * 2)})`,
  },
}));

export const Sidebar = () => {
  const { classes } = useStyles();

  const navList = (
    <List
      component="nav"
      aria-label="sidebar"
      subheader={<ListSubheader component="div">MENU</ListSubheader>}
    >
      <NavItem to="/dashboard" label="My Dashboard" icon={Dashboard} />
      <NavItem
        to="/projects"
        label="Projects"
        icon={FolderOpen}
        active={[
          { path: '/projects', end: false },
          { path: '/engagements', end: false },
        ]}
      />
      <NavItem to="/languages" label="Languages" icon={Language} />
      <NavItem to="/users" label="People" icon={Person} />
      <NavItem to="/partners" label="Partners" icon={PeopleJoinedIcon} />
    </List>
  );

  return (
    <ThemeProvider theme={sidebarTheme}>
      <Paper elevation={0} square className={classes.root}>
        <SidebarHeader />
        <div className={classes.content}>
          <CreateButtonMenu fullWidth className={classes.createNewItem} />
          {navList}
        </div>
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
