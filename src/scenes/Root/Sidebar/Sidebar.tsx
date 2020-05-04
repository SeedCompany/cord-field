import {
  List,
  ListSubheader,
  makeStyles,
  Menu,
  MenuItem,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { Add, FolderOpen, Language, People } from '@material-ui/icons';
import { FC, useState } from 'react';
import * as React from 'react';
import { ErrorButton } from '../../../components/ErrorButton';
import { CordIcon, PlantIcon } from '../../../components/Icons';
import { createTheme } from '../../../theme';
import { SidebarListLink } from './SidebarListLink';
import { SwooshBackground } from './SwooshBackground';

const useStyles = makeStyles(({ spacing, palette }) => ({
  sidebarContent: {
    padding: spacing(4, 2),
  },
  list: {
    backgroundColor: '#3c444e',
    maxWidth: '248px',
    height: '100%',
    padding: 0,
  },
  createNewItem: {
    height: '40px',
    marginBottom: spacing(1),
  },
  menuText: {
    // color: palette.text.secondary,
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
    fontSize: '40px',
    color: palette.primary.contrastText,
    marginBottom: spacing(2),
  },
  copyright: {
    // color: '#fbfbfb',
    fontWeight: 300,
  },
}));

const sidebarTheme = createTheme({ dark: true });

export const Sidebar: FC = () => {
  const {
    list,
    sidebarContent,
    createNewItem,
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
    <ThemeProvider theme={sidebarTheme}>
      <List className={list} component="nav" aria-label="sidebar">
        <SwooshBackground />
        <div className={floating}>
          <CordIcon className={cordIcon} />
          <Typography className={copyright} display="block" variant="caption">
            © Cord Field 2020
          </Typography>
        </div>
        <div className={sidebarContent}>
          <ErrorButton
            className={createNewItem}
            fullWidth
            aria-controls="create-menu"
            aria-haspopup="true"
            variant="contained"
            startIcon={<Add />}
            onClick={handleClick}
          >
            Create New Item
          </ErrorButton>
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

          <List
            component="nav"
            aria-label="sidebar"
            subheader={<ListSubheader component="div">MENU</ListSubheader>}
          >
            <SidebarListLink
              to="/projects"
              linkName="Projects"
              icon={<FolderOpen />}
            />
            <SidebarListLink
              to="/languages"
              linkName="Languages"
              icon={<Language />}
            />
            <SidebarListLink
              to="/internships"
              linkName="Internships"
              icon={<PlantIcon />}
            />
            <SidebarListLink to="/People" linkName="People" icon={<People />} />
            <SidebarListLink
              to="/organizations"
              linkName="Organizations"
              icon={<People />}
            />
          </List>
        </div>
      </List>
    </ThemeProvider>
  );
};
