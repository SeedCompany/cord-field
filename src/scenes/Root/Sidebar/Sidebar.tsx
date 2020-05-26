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
import { CreateButton } from '../../../components/CreateButton';
import { useDialog } from '../../../components/Dialog';
import { ListItemLink, ListItemLinkProps } from '../../../components/Routing';
import { CreateOrganization } from '../../Organizations/Create';
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

  const openAddMenu = (e: any) => setAnchorEl(e.currentTarget);
  const closeAddMenu = () => setAnchorEl(null);
  const closeAnd = (fn: () => void) => () => {
    closeAddMenu();
    fn();
  };
  const [createOrgState, createOrg] = useDialog();

  const createMenu = (
    <Menu
      id="create-menu"
      open={anchorEl !== null}
      anchorEl={anchorEl}
      keepMounted
      onClose={closeAddMenu}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <MenuItem onClick={closeAnd(createOrg)}>Organization</MenuItem>
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
      <NavItem to="/users" label="People" icon={People} />
      <NavItem to="/organizations" label="Partners" icon={People} />
    </List>
  );

  const sidebar = (
    <ThemeProvider theme={sidebarTheme}>
      <Paper square className={classes.root}>
        <SidebarHeader />
        <div className={classes.content}>
          <CreateButton
            className={classes.createNewItem}
            fullWidth
            aria-controls="create-menu"
            aria-haspopup="true"
            startIcon={<Add />}
            onClick={openAddMenu}
          >
            Create New Item
          </CreateButton>
          {createMenu}
          {navList}
        </div>
      </Paper>
    </ThemeProvider>
  );

  return (
    <>
      {sidebar}
      <CreateOrganization {...createOrgState} />
    </>
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
