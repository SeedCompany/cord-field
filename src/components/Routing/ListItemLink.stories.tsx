import { List, ListItemIcon, ListItemText } from '@mui/material';
import { Home as HomeIcon, Launch, Lock } from '@mui/icons-material';
import { ListItemLink as LIL } from './ListItemLink';

export default { title: 'Components/Routing' };

export const ListItemLink = () => (
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
);
