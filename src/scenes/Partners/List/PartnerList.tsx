import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { PartnerGrid } from './PartnerGrid';

export const PartnerList = () => {
  return (
    <Stack sx={{ flex: 1, padding: 4, pt: 2 }}>
      <Helmet title="Partners" />
      <Stack component="main" sx={{ flex: 1 }}>
        <Typography variant="h2" paragraph>
          Partners
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
            <PartnerGrid />
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
};
