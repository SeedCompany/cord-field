import { type Tabs as __Tabs, Paper, Stack, Typography } from '@mui/material';
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
        <Paper
          sx={(theme) => ({
            containerType: 'size',
            flex: 1,
            minHeight: 375,
            maxWidth: `${theme.breakpoints.values.lg}px`,
          })}
        >
          <PartnerGrid />
        </Paper>
      </Stack>
    </Stack>
  );
};
