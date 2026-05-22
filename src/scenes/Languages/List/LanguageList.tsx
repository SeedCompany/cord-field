import { Paper, Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { LanguageGrid } from './LanguageGrid';

export const LanguageList = () => {
  return (
    <Stack sx={{ flex: 1, padding: { xs: 1, sm: 4 }, pt: 2 }}>
      <Helmet title="Languages" />
      <Stack component="main" sx={{ flex: 1 }}>
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
            <LanguageGrid />
          </Paper>
        </Stack>
      </Stack>
    </Stack>
  );
};
