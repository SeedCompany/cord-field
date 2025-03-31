import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { UserGrid } from './UserGrid';

export const UserList = () => {
  return (
    <Stack sx={{ flex: 1, padding: 4, pt: 2 }}>
      <Helmet title="People" />
      <Stack component="main" sx={{ flex: 1 }}>
        <Typography variant="h2" paragraph>
          People
        </Typography>
        <Stack sx={{ flex: 1, containerType: 'size' }}>
          <Paper
            sx={{
              flex: 1,
              minHeight: 375,
              maxHeight: '100cqh',
              width: 'min-content',
              maxWidth: '100cqw',
            }}
          >
            <UserGrid />
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
};
