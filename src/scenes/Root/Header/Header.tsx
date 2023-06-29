import { Box } from '@mui/material';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const headerSx = {
  justifyContent: 'space-between',
  alignItems: 'center',
  display: { xs: 'none', sm: 'flex' },
  bgcolor: '#ffffff',
};

export const Header = () => {
  return (
    <Box component="header" sx={headerSx}>
      <HeaderSearch />
      <ProfileToolbar />
    </Box>
  );
};
