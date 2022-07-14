import { FolderOpen, Language, Person } from '@mui/icons-material';
import {
  List,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Paper,
  SvgIconProps,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ComponentType } from 'react';
import { PeopleJoinedIcon } from '../../../components/Icons';
import { ListItemLink, ListItemLinkProps } from '../../../components/Routing';
import { CreateButtonMenu } from '../Creates';
import { sidebarTheme } from './sidebar.theme';
import { SidebarHeader } from './SidebarHeader';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    maxWidth: 248,
    overflowY: 'auto',
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
  const classes = useStyles();

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
      <Paper square className={classes.root}>
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
