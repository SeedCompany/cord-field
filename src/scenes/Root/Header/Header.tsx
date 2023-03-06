import { Box, Theme } from '@mui/material';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const headerSx = (theme: Theme) => ({
  padding: theme.spacing(4, 4, 1, 4),
  justifyContent: 'space-between',
  [theme.breakpoints.up('xs')]: {
    display: 'none',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
  [theme.breakpoints.up('mobile')]: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

export const Header = () => {
  return (
    <Box component="header" sx={headerSx}>
      <HeaderSearch />
      <ProfileToolbar />
    </Box>
  );
};
