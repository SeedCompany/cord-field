import { Box } from '@mui/material';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

export const Header = () => {
  return (
    <Box
      component="header"
      sx={(theme) => ({
        padding: theme.spacing(4, 4, 1, 4),
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      })}
    >
      <HeaderSearch />
      <ProfileToolbar />
    </Box>
  );
};
