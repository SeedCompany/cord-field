import { Close, FolderOpen, Language, Menu, Person } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
  Toolbar,
  Typography,
} from '@mui/material';
import { ComponentType, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { extendSx, StyleProps } from '~/common';
import { PeopleJoinedIcon } from '~/components/Icons';
import { ListItemLink, ListItemLinkProps } from '~/components/Routing';
import { CreateButtonMenu } from '../Creates';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

export const MobileNavbar = ({ sx }: StyleProps) => {
  const [open, setState] = useState(false);

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    //changes the function state according to the value of open
    setState(open);
  };

  const navList = (
    <List component="nav" aria-label="Mobile Menu">
      <NavItem to="/projects" label="Projects" icon={FolderOpen} />
      <NavItem to="/languages" label="Languages" icon={Language} />
      <NavItem to="/users" label="People" icon={Person} />
      <NavItem to="/partners" label="Partners" icon={PeopleJoinedIcon} />
    </List>
  );

  const currentNavLocation = useLocation();
  const activeViewLabel = (
    <Typography
      variant="subtitle1"
      sx={{ color: 'info.contrastText', fontWeight: 'bold' }}
    >
      {navList.props.children.map((item: any) => {
        if (item.props.to === currentNavLocation.pathname) {
          return item.props.label;
        } else {
          return null;
        }
      })}
      {currentNavLocation.pathname.includes('/users/') && 'Profile'}
    </Typography>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'secondary.main',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" disableGutters={true}>
        <Toolbar>
          <Box
            sx={[
              {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              },
              ...extendSx(sx),
            ]}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <Menu />
              </IconButton>
              {activeViewLabel}
            </Box>
            <HeaderSearch sx={{ mb: -0.5, mr: -2 }} />
          </Box>
          <Drawer
            anchor="left"
            open={open}
            onClose={toggleDrawer(false)}
            BackdropProps={{ invisible: true }} // removes the greyedout backdrop that is default
            sx={{
              '& > .MuiDrawer-paper': { width: 240 },
            }}
          >
            <Box
              sx={{
                p: 2,
                height: 1,
                backgroundColor: 'secondary.main',
                color: 'primary.contrastText',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: -1,
                }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer(false)}
                  sx={{ mb: 2 }}
                >
                  <Close />
                </IconButton>

                <Typography
                  variant="body1"
                  sx={{
                    flexGrow: 1,
                    fontWeight: 700,
                    mb: 2,
                    color: 'primary.contrastText',
                  }}
                >
                  {activeViewLabel}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'primary.contrastText',
                    fontWeight: 400,
                    fontSize: 24,
                    lineHeight: '32px',
                  }}
                >
                  Cord Field
                </Typography>
                <Typography
                  display="block"
                  variant="caption"
                  sx={{
                    color: 'primary.contrastText',
                    fontWeight: 'fontWeightLight',
                  }}
                >
                  © Seed Company
                </Typography>
              </Box>

              <Divider
                sx={{ bgcolor: 'primary.contrastText', ml: -2, width: 240 }}
              />
              <Box sx={{ ml: -1.8 }}>{navList}</Box>
              <Divider
                sx={{
                  mb: 1,
                  bgcolor: 'primary.contrastText',
                  ml: -2,
                  width: 240,
                }}
              />
              <CreateButtonMenu sx={{ ml: -1 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: '0',
                  mb: 1,
                }}
              >
                <ProfileToolbar />
              </Box>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
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
      <Icon sx={{ color: 'primary.contrastText' }} />
    </ListItemIcon>
    <ListItemText
      sx={{ '& .MuiTypography-root': { color: 'primary.contrastText' } }}
    >
      {label}
    </ListItemText>
  </ListItemLink>
);
