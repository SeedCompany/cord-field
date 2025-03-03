import { Box, Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { UserGrid } from './UserGrid';

export const UserList = () => {
  return (
    <Stack sx={{ flex: 1, padding: 4, pt: 2 }}>
      <Helmet title="People" />
      <Stack
        component="main"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant="h2" paragraph>
          People
        </Typography>
        <Box
          component={Paper}
          sx={{
            containerType: 'size',
            flexDirection: 'column',
            flex: 1,
            minHeight: 375,
          }}
        >
          <UserGrid />
        </Box>
      </Stack>
    </Stack>
  );
};
