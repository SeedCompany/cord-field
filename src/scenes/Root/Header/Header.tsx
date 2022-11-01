import { Box } from '@mui/material';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

export const Header = () => {
  return (
    <Box
      component="header"
      sx={{
        mt: 4,
        mx: 4,
        mb: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <HeaderSearch />
      <ProfileToolbar />
    </Box>
  );
};
