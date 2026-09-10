import { useQuery } from '@apollo/client';
import { ArrowBack } from '@mui/icons-material';
import { Box, Drawer } from '@mui/material';
import { useMatch } from 'react-router-dom';
import { ChildrenProp, flexColumn } from '~/common';
import { MaintenanceBanner } from '~/components/MaintenanceBanner';
import { ButtonLink, useNavigate } from '~/components/Routing';
import { ProgressReportContextProvider } from './ProgressReportContext';
import { ProgressReportDrawerHeader } from './ProgressReportDrawerHeader';
import { ProgressReportEditDocument } from './ProgressReportEdit.graphql';
import { ProgressReportSidebar } from './ProgressReportSidebar';
import { ReportProp } from './ReportProp';
import { StartReportPage } from './StartReportPage';
import { StepContainer } from './StepContainer';
import { Steps } from './Steps';

interface ProgressReportDrawerProps {
  reportId: string;
}

export const ProgressReportDrawer = ({
  reportId,
}: ProgressReportDrawerProps) => {
  const { data, error } = useQuery(ProgressReportEditDocument, {
    variables: {
      progressReportId: reportId,
    },
    fetchPolicy: 'cache-and-network',
  });
  const report = data?.periodicReport;

  if (error || (report && report.__typename !== 'ProgressReport')) {
    // Detail page will handle an incorrect type or loading errors
    return null;
  }

  if (!report) {
    // TODO loading state
    return null;
  }

  return (
    <ProgressReportContextProvider report={report} steps={Steps}>
      <EditShell>
        <EditLayout report={report} />
      </EditShell>
    </ProgressReportContextProvider>
  );
};

const EditShell = ({ children }: ChildrenProp) => {
  const open = !!useMatch('progress-reports/:id/edit');
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => navigate('../')}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
        },
      }}
    >
      {/* This drawer covers the whole viewport, hiding the app shell's copy —
          and a report is exactly the long-lived work someone can lose to an
          unexpected read-only window. */}
      <MaintenanceBanner layer="overlay" />
      {children}
    </Drawer>
  );
};

const EditLayout = ({ report }: ReportProp) => {
  if (report.status.value === 'NotStarted') {
    return <StartReportPage report={report} />;
  }

  return (
    <Box
      sx={{
        m: { xs: 2, md: 4 },
        mt: 2,
        display: 'flex',
        // Stack into one column on mobile; the sidebar can't sit beside the
        // content on a narrow screen without squeezing/overflowing it.
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 4 },
      }}
    >
      {/* Mobile only: the header's own "Back" sits in the content column, which
          stacks below the sidebar on mobile — so surface a back link up top. */}
      <ButtonLink
        to=".."
        color="secondary"
        startIcon={<ArrowBack />}
        sx={{ order: 0, alignSelf: 'start', display: { md: 'none' } }}
      >
        Back To Overview
      </ButtonLink>
      <Box css={flexColumn} sx={{ flex: 1, gap: 2, order: { xs: 2, md: 1 } }}>
        <ProgressReportDrawerHeader report={report} />
        <StepContainer report={report} />
      </Box>
      <ProgressReportSidebar
        report={report}
        sx={(theme) => ({
          // Nav/status first on mobile (above the form), beside it on desktop.
          order: { xs: 1, md: 2 },
          [theme.breakpoints.up('md')]: {
            top: theme.spacing(2), // matches mt above
            position: 'sticky',
            alignSelf: 'start',
          },
        })}
      />
    </Box>
  );
};
