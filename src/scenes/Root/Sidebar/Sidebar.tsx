import {
  Button,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Add, FolderOpen, Language, People } from '@material-ui/icons';
import { FC, useState } from 'react';
import * as React from 'react';
import { CordIcon, InternshipsIcon } from '../../../components/Icons';
import { SidebarListLink } from './SidebarListLink';
import { SwooshIcon } from './SwooshIcon';

const useStyles = makeStyles(({ spacing, palette }) => ({
  listContent: {
    padding: spacing(4, 2),
  },
  list: {
    backgroundColor: '#3c444e',
    maxWidth: '248px',
    height: '100%',
    padding: 0,
  },
  createListItem: {
    justifyContent: 'center',
    marginBottom: spacing(3),
  },
  createButton: {
    width: '184px',
    backgroundColor: '#ff5a5f',
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
    color: palette.text.secondary,
  },
  links: {
    padding: spacing(0, 2),
  },
  floating: {
    position: 'absolute',
    top: spacing(3),
    left: spacing(4),
  },
  cordIcon: {
    height: '45px',
    width: '38px',
    color: palette.primary.contrastText,
    marginBottom: spacing(2),
  },
  copyright: {
    color: '#fbfbfb',
    fontWeight: 300,
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
    floating,
    cordIcon,
    copyright,
  } = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <List className={list} component="nav" aria-label="sidebar">
      <SwooshIcon />
      <div className={floating}>
        <CordIcon className={cordIcon} />
        <Typography className={copyright} display="block" variant="caption">
          © Cord Field 2020
        </Typography>
      </div>
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
          icon={<InternshipsIcon />}
        />
        <SidebarListLink to="/People" linkName="People" icon={<People />} />
        <SidebarListLink
          to="/Organizations"
          linkName="Organizations"
          icon={<People />}
        />
      </div>
    </List>
  );
};
