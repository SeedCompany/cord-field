import React from 'react';
import { ProfileMenu as PM } from './ProfileMenu';

export default { title: 'Scenes/Root/Header' };

export const ProfileMenu = () => (
  <PM anchorEl={null} handleClose={() => false} />
);
