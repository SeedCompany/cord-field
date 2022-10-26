import { ArrowBack } from '@mui/icons-material';
import { Box, Card, Theme, Typography } from '@mui/material';
import { Link } from '~/components/Routing';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useProgressReportContext } from '../../ProgressReportContext';

export const ProgressReportDrawerHeader = () => {
  const { setCurrentProgressReport } = useProgressReportContext();

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        flexDirection: 'column',
        padding: 2,
        pt: 0,
      }}
    >
      <Link
        to=".."
        sx={(theme: Theme) => ({
          color: theme.palette.grey[800],
          cursor: 'pointer',
          marginTop: -2,
          '&:hover': {
            textDecoration: 'underline',
          },
          marginBottom: 2,
        })}
        onClick={() => {
          setCurrentProgressReport(null);
        }}
      >
        <ArrowBack
          sx={{
            marginRight: 1,
            fontSize: '1.25rem',
            marginBottom: '-4px',
          }}
        />
        All Reports
      </Link>
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
