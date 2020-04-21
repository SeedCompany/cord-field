import { List, ListItemIcon, ListItemText } from '@material-ui/core';
import { Home as HomeIcon, Launch, Lock } from '@material-ui/icons';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ListItemLink as LIL } from './ListItemLink';

export default { title: 'Components/Routing' };

export const ListItemLink = () => (
  <MemoryRouter>
    <List>
      <LIL to="/">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText>Home</ListItemText>
      </LIL>
      <LIL selected={false} to="/">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText>Home - but I'm never "selected/active"</ListItemText>
      </LIL>
      <LIL to="/login">
        <ListItemIcon>
          <Lock />
        </ListItemIcon>
        <ListItemText>Login</ListItemText>
      </LIL>
      <LIL external to="https://google.com" target="_blank">
        <ListItemText>Google</ListItemText>
        <ListItemIcon>
          <Launch />
        </ListItemIcon>
      </LIL>
    </List>
  </MemoryRouter>
);
