import { Box, Card, Typography } from '@mui/material';
import { SensitivityIcon } from '~/components/Sensitivity';
import { ProgressReportFragment } from '../ProgressReportDetail.graphql';

export const ProgressReportDrawerHeader = ({
  report,
}: {
  report?: ProgressReportFragment | null;
}) => {
  if (!report) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        flexDirection: 'column',
        padding: 2,
      }}
    >
      <Typography variant="h2">Project Name | Engagement Name</Typography>
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'row',
          '& > *': {
            marginRight: 2,
          },
        }}
      >
        <Card elevation={0} variant="outlined" sx={{ p: 2, pt: 1, pb: 1 }}>
          <Typography variant="subtitle2" color="text.gray">
            Location
          </Typography>
          <Typography variant="body1">
            Ethiopia | Africa - Anglophone West
          </Typography>
        </Card>
        <Card elevation={0} variant="outlined" sx={{ p: 2, pt: 1, pb: 1 }}>
          <Typography variant="subtitle2" color="text.gray">
            Sensitivity
          </Typography>
          <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
            HIGH
            <SensitivityIcon
              value="High"
              sx={{
                height: 16,
              }}
            />
          </Typography>
        </Card>
      </Box>
    </Box>
  );
};
