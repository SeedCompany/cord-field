import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { LanguageGrid } from './LanguageGrid';

export const LanguageList = () => {
  return (
    <Stack sx={{ flex: 1, padding: 4, pt: 2 }}>
      <Helmet title="Languages" />
      <Stack component="main" sx={{ flex: 1 }}>
        <Typography variant="h2" paragraph>
          Languages
        </Typography>
        <Paper
          sx={(theme) => ({
            containerType: 'size',
            flex: 1,
            minHeight: 375,
            maxWidth: `${theme.breakpoints.values.lg}px`,
          })}
        >
          <LanguageGrid />
        </Paper>
      </Stack>
    </Stack>
  );
};
