import {
  List,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  SvgIconProps,
  ThemeProvider,
} from '@material-ui/core';
import { Add, FolderOpen, Language, People } from '@material-ui/icons';
import { ComponentType, FC, useState } from 'react';
import * as React from 'react';
import { ErrorButton } from '../../../components/ErrorButton';
import { PlantIcon } from '../../../components/Icons';
import { ListItemLink, ListItemLinkProps } from '../../../components/Routing';
import { sidebarTheme } from './sidebar.theme';
import { SidebarHeader } from './SidebarHeader';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    maxWidth: 248,
  },
  content: {
    padding: spacing(0, 2),
  },
  createNewItem: {
    margin: spacing(4, 2, 1),
    width: `calc(100% - ${spacing(2 * 2)}px)`,
  },
}));

export const Sidebar: FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const createMenu = (
    <Menu
      id="create-menu"
      open={anchorEl !== null}
      anchorEl={anchorEl}
      keepMounted
      onClose={handleClose}
    >
      <MenuItem>
        {/* Waiting on information for what goes in here */}
        Project
      </MenuItem>
    </Menu>
  );

  const navList = (
    <List
      component="nav"
      aria-label="sidebar"
      subheader={<ListSubheader component="div">MENU</ListSubheader>}
    >
      <NavItem to="/projects" label="Projects" icon={FolderOpen} />
      <NavItem to="/languages" label="Languages" icon={Language} />
      <NavItem to="/internships" label="Internships" icon={PlantIcon} />
      <NavItem to="/users" label="People" icon={People} />
      <NavItem to="/organizations" label="Partners" icon={People} />
    </List>
  );

  return (
    <ThemeProvider theme={sidebarTheme}>
      <Paper square className={classes.root}>
        <SidebarHeader />
        <div className={classes.content}>
          <ErrorButton
            className={classes.createNewItem}
            fullWidth
            aria-controls="create-menu"
            aria-haspopup="true"
            variant="contained"
            startIcon={<Add />}
            onClick={handleClick}
          >
            Create New Item
          </ErrorButton>
          {createMenu}
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
