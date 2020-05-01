import {
  Button,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { Add, FolderOpen, Language, People } from '@material-ui/icons';
import { FC, useState } from 'react';
import * as React from 'react';
import { Picture } from '../Picture';
import { InternshipsSvg } from './InternshipsSvg';
import { SidebarListLink } from './SidebarListLink';

const useStyles = makeStyles(({ spacing }) => ({
  listContent: {
    padding: spacing(4, 2),
  },
  list: {
    backgroundColor: '#3c444e',
    maxWidth: '248px',
    height: '100%',
    padding: 0,
  },
  internshipIcon: {
    marginLeft: spacing(0.5),
  },
  createListItem: {
    justifyContent: 'center',
    marginBottom: spacing(3),
  },
  createButton: {
    width: '184px',
  },
  menuHeaderListItem: {
    padding: 0,
    marginBottom: spacing(1),
  },
  menuHeaderText: {
    color: '#d1dadf',
    marginLeft: spacing(2),
  },
  menuText: {
    color: '#8f928b',
  },
  links: {
    padding: spacing(0, 2),
  },
}));

export const Sidebar: FC = () => {
  const {
    list,
    listContent,
    createListItem,
    createButton,
    menuHeaderText,
    menuHeaderListItem,
  } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <List className={list} component="nav" aria-label="sidebar">
      <Picture source="images/sidebar-icon.svg" />
      <div className={listContent}>
        <ListItem className={createListItem}>
          <Button
            className={createButton}
            aria-controls="create-menu"
            aria-haspopup="true"
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={handleClick}
          >
            Create New Item
          </Button>
          <Menu
            id="create-menu"
            open={anchorEl !== null}
            anchorEl={anchorEl}
            keepMounted
            onClose={handleClose}
          >
            <MenuItem>
              {/* Waiting on information for what goes in here */}
              SOMETHING GOES IN MENU
            </MenuItem>
          </Menu>
        </ListItem>

        <ListItem className={menuHeaderListItem}>
          <ListItemText
            primaryTypographyProps={{
              variant: 'body2',
              className: menuHeaderText,
            }}
          >
            MENU
          </ListItemText>
        </ListItem>

        <SidebarListLink
          to="/Projects"
          linkName="Projects"
          icon={<FolderOpen />}
        />
        <SidebarListLink
          to="/Languages"
          linkName="Languages"
          icon={<Language />}
        />
        <SidebarListLink
          to="/Internships"
          linkName="Internships"
          icon={<InternshipsSvg />}
        />
        <SidebarListLink to="/People" linkName="People" icon={<People />} />
        <SidebarListLink
          to="/Organizations"
          linkName="Organzations"
          icon={<People />}
        />
      </div>
    </List>
  );
};
