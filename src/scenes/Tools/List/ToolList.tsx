import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ToolGrid } from './ToolGrid';

export const ToolList = () => {
  return (
    <Stack sx={{ flex: 1, padding: 4, pt: 2 }}>
      <Helmet title="Tools" />
      <Stack component="main" sx={{ flex: 1 }}>
        <Typography variant="h2" paragraph>
          Tools
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
            <ToolGrid />
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
};
