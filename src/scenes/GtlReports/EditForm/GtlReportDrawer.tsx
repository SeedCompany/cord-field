import { useQuery } from '@apollo/client';
import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useMatch } from 'react-router-dom';
import { flexColumn } from '~/common';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ButtonLink, useNavigate } from '../../../components/Routing';
import {
  GtlReportDetailDocument,
  type GtlReportDetailFragment,
} from '../Detail/GtlReportDetail.graphql';
import { StartGtlReportPage } from './StartGtlReportPage';
import { GtlSteps } from './Steps';
import { useGtlStep } from './useGtlStep';

/**
 * The GTL reporting wizard.
 *
 * A drawer over the overview page, opened by the `/edit` route — the same shape
 * as the Momentum wizard, so the two feel like one product. It is a separate
 * shell rather than a reuse of Momentum's because that one's step contract is
 * typed to the progress-report fragment; generalising it would have touched all
 * six of its steps for no gain here.
 */
export const GtlReportDrawer = ({ reportId }: { reportId: string }) => {
  const open = !!useMatch('gtl-reports/:id/edit');
  const navigate = useNavigate();
  const { data } = useQuery(GtlReportDetailDocument, {
    variables: { id: reportId },
    fetchPolicy: 'cache-and-network',
    skip: !open,
  });

  const report =
    data?.periodicReport.__typename === 'GTLReport'
      ? (data.periodicReport as GtlReportDetailFragment)
      : null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => navigate(`/gtl-reports/${reportId}`)}
      sx={{ '& .MuiDrawer-paper': { width: '100%' } }}
    >
      {!report ? (
        <Box sx={{ p: 4 }}>
          <Skeleton variant="rectangular" height={300} />
        </Box>
      ) : report.status.value === 'NotStarted' ? (
        <StartGtlReportPage report={report} />
      ) : (
        <WizardLayout report={report} />
      )}
    </Drawer>
  );
};

const WizardLayout = ({ report }: { report: GtlReportDetailFragment }) => {
  // Absolute, not `..`: this page is rendered by a `:reportId/*` route, so the
  // relative base is already the report — `..` would land on /gtl-reports,
  // which has no index route and 404s.
  const overview = `/gtl-reports/${report.id}`;
  // A step whose section the viewer cannot reach is dropped entirely, so the
  // nav never offers a dead end.
  const steps = useMemo(
    () =>
      Object.entries(GtlSteps).flatMap(([section, entries]) => {
        const enabled = entries.filter(
          ([, step]) => step.enableWhen?.(report) ?? true
        );
        return enabled.length > 0 ? [[section, enabled] as const] : [];
      }),
    [report]
  );
  const flat = steps.flatMap(([, entries]) => entries);
  const { current, setStep } = useGtlStep(flat.map(([label]) => label));
  const index = flat.findIndex(([label]) => label === current);
  const Step = flat[index]?.[1];

  return (
    <Box
      sx={{
        m: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 4 },
      }}
    >
      <ButtonLink
        to={overview}
        color="secondary"
        startIcon={<ArrowBack />}
        sx={{ alignSelf: 'start', order: 0, display: { md: 'none' } }}
      >
        Back to overview
      </ButtonLink>

      <Box css={flexColumn} sx={{ flex: 1, gap: 2, order: { xs: 2, md: 1 } }}>
        <Box>
          <ButtonLink
            to={overview}
            color="secondary"
            startIcon={<ArrowBack />}
            sx={{ display: { xs: 'none', md: 'inline-flex' }, mb: 1 }}
          >
            Back to overview
          </ButtonLink>
          <Typography variant="h2">
            <ReportLabel report={report} /> Report
          </Typography>
        </Box>

        {Step && <Step report={report} />}

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            disabled={index <= 0}
            onClick={() => setStep(flat[index - 1]![0])}
          >
            Back
          </Button>
          <Button
            variant="contained"
            disabled={index >= flat.length - 1}
            onClick={() => setStep(flat[index + 1]![0])}
          >
            Next
          </Button>
        </Stack>
      </Box>

      <Box sx={{ order: { xs: 1, md: 2 }, minWidth: 240 }}>
        {steps.map(([section, entries]) => (
          <Box key={section} sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary">
              {section}
            </Typography>
            <List dense disablePadding>
              {entries.map(([label]) => (
                <ListItemButton
                  key={label}
                  selected={label === current}
                  onClick={() => setStep(label)}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
