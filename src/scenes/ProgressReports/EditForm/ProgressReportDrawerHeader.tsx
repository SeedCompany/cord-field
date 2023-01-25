import { ArrowBack } from '@mui/icons-material';
import { Box, Card, Divider, Typography } from '@mui/material';
import { ReportLabel } from '~/components/PeriodicReports/ReportLabel';
import { ButtonLink } from '~/components/Routing';
import { SensitivityIcon } from '~/components/Sensitivity';
import { ReportProp } from './ReportProp';

export const ProgressReportDrawerHeader = ({ report }: ReportProp) => {
  const language = report.parent.language;
  const project = report.parent.project;
  const sensitivity = report.parent.sensitivity;

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        flexDirection: 'column',
        padding: 2,
      }}
    >
      <ButtonLink
        to=".."
        color="secondary"
        startIcon={<ArrowBack />}
        sx={{ alignSelf: 'start' }}
      >
        Back To Overview
      </ButtonLink>
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
          {project.primaryLocation.value?.name.canRead && (
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
      <Box sx={{ display: 'flex', mt: 2 }}>
        <Typography variant="h5">{project.name.value}</Typography>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 2, borderRightColor: 'black', borderRightWidth: 2 }}
        />
        <Typography variant="h5">
          {language.value?.displayName.value}
        </Typography>
      </Box>

      <Typography
        variant="h2"
        sx={{ mt: 2, gap: 2, display: 'flex', alignItems: 'flex-end' }}
      >
        <span>
          Quarterly Report &mdash; <ReportLabel report={report} />
        </span>
      </Typography>
    </Box>
  );
};
