import { useQuery } from '@apollo/client';
import { Box, Drawer } from '@mui/material';
import { useMatch } from 'react-router-dom';
import { ChildrenProp, flexColumn } from '~/common';
import { useNavigate } from '~/components/Routing';
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
      {children}
    </Drawer>
  );
};

const EditLayout = ({ report }: ReportProp) => {
  if (report.status.value === 'NotStarted') {
    return <StartReportPage report={report} />;
  }

  return (
    <Box sx={{ m: 4, mt: 2, display: 'flex', gap: 4 }}>
      <Box css={flexColumn} sx={{ flex: 1, gap: 2 }}>
        <ProgressReportDrawerHeader report={report} />
        <StepContainer report={report} />
      </Box>
      <ProgressReportSidebar
        report={report}
        sx={(theme) => ({
          top: theme.spacing(2), // matches mt above
          position: 'sticky',
          alignSelf: 'start',
        })}
      />
    </Box>
  );
};
