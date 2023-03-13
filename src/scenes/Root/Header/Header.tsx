import { Box, Theme } from '@mui/material';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const headerSx = (theme: Theme) => ({
  padding: theme.spacing(4, 4, 1, 4),
  justifyContent: 'space-between',
  display: { xs: 'none', sm: 'flex' },
  flexDirection: { sm: 'column', mobile: 'row' },
  alignItems: { mobile: 'flex-start' },
});

export const Header = () => {
  return (
    <Box component="header" sx={headerSx}>
      <HeaderSearch />
      <ProfileToolbar />
    </Box>
  );
};
