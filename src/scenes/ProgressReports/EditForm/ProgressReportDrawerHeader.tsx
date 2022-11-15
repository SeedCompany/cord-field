import { ArrowBack } from '@mui/icons-material';
import { Box, Card, Divider, Skeleton, Theme, Typography } from '@mui/material';
import { ReportLabel } from '~/components/PeriodicReports/ReportLabel';
import { Link } from '~/components/Routing';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useProgressReportContext } from './ProgressReportContext';

export const ProgressReportDrawerHeader = () => {
  const { report } = useProgressReportContext();

  const language = report?.parent.language;
  const project = report?.parent.project;
  const sensitivity = report?.parent.sensitivity;

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
      >
        <ArrowBack
          sx={{
            marginRight: 1,
            fontSize: '1.25rem',
            marginBottom: '-4px',
          }}
        />
        Back
      </Link>
      <div css={{ display: 'flex' }}>
        {report ? (
          <Typography variant="h2">{project?.name.value}</Typography>
        ) : (
          <Skeleton variant="text" height={40} width={200} />
        )}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 2, borderRightColor: 'black', borderRightWidth: 2 }}
        />
        {report ? (
          <Typography variant="h2">
            {language?.value?.displayName.value}
          </Typography>
        ) : (
          <Skeleton variant="text" height={40} width={200} />
        )}
      </div>
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
        <Card elevation={0} variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.gray">
            Location
          </Typography>
          {project?.primaryLocation.value?.name.canRead && (
            <div css={{ display: 'flex' }}>
              <Typography variant="body1">
                {project.primaryLocation.value.name.value}
              </Typography>
              {project.fieldRegion.value && (
                <span
                  css={(theme) => ({
                    marginRight: theme.spacing(1),
                    marginLeft: theme.spacing(1),
                  })}
                >
                  |
                </span>
              )}
              <Typography variant="body1">
                {project.fieldRegion.value?.name.value}
              </Typography>
            </div>
          )}

          {!report && <Skeleton variant="text" height={20} width={200} />}
        </Card>
        <Card elevation={0} variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.gray">
            Sensitivity
          </Typography>
          <Typography variant="body1" sx={{ textTransform: 'uppercase' }}>
            {sensitivity}
            <SensitivityIcon
              value={sensitivity}
              sx={{
                height: 16,
              }}
            />
          </Typography>
        </Card>
      </Box>
      <Box>
        {report && (
          <Typography variant="h2" sx={{ mt: 2 }}>
            <ReportLabel report={report} /> &mdash; Field Report
          </Typography>
        )}
      </Box>
    </Box>
  );
};
