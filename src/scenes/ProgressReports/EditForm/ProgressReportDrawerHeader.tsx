import {
  ArrowBack,
  Public as GlobeIcon,
  Place as MapPinIcon,
} from '@mui/icons-material';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { flexColumn, increaseAlpha } from '~/common';
import { DataButton } from '~/components/DataButton';
import { ReportLabel } from '~/components/PeriodicReports/ReportLabel';
import { ButtonLink } from '~/components/Routing';
import { SensitivityIcon } from '~/components/Sensitivity';
import { ReportProp } from './ReportProp';

export const ProgressReportDrawerHeader = ({ report }: ReportProp) => {
  const language = report.parent.language;
  const project = report.parent.project;
  const sensitivity = report.parent.sensitivity;

  return (
    <Box css={flexColumn}>
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <DataButton
            label="Primary Location"
            startIcon={<MapPinIcon color="info" />}
            empty="None"
            secured={project.primaryLocation}
            redacted="You do not have permission to view primary location"
            children={(location) => location.name.value}
          />
          <DataButton
            label="Field Region"
            startIcon={<GlobeIcon color="info" />}
            empty="None"
            secured={project.fieldRegion}
            redacted="You do not have permission to view field region"
            children={(location) => location.name.value}
          />
          <DataButton
            label="Sensitivity"
            loading={!project}
            startIcon={
              <SensitivityIcon
                value={sensitivity}
                loading={!project}
                disableTooltip
              />
            }
          >
            {sensitivity}
          </DataButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <Stack
          direction="row"
          divider={
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={(theme) => ({
                // Tweak color to be more visible since it's so small.
                borderColor: increaseAlpha(theme.palette.divider, 0.2),
                // Center vertically better with font line height
                position: 'relative',
                top: 3,
              })}
            />
          }
          sx={{ gap: 2 }}
        >
          <Typography variant="h5">{project.name.value}</Typography>
          <Typography variant="h5">
            {language.value?.displayName.value}
          </Typography>
        </Stack>
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
