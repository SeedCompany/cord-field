import { MenuList, Paper } from '@material-ui/core';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MenuItemLink as MIL } from './MenuItemLink';

export default { title: 'Components/Routing' };

export const MenuItemLink = () => (
  <MemoryRouter>
    <div style={{ display: 'flex' }}>
      <Paper>
        <MenuList>
          <MIL to="/">Home</MIL>
          <MIL to="/login">Login</MIL>
          <MIL external to="https://google.com" target="_blank">
            Google
          </MIL>
        </MenuList>
      </Paper>
    </div>
  </MemoryRouter>
);
