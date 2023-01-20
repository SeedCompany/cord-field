import { useQuery } from '@apollo/client';
import { Box, Drawer } from '@mui/material';
import { ReactNode } from 'react';
import { useMatch } from 'react-router-dom';
import { Error } from '~/components/Error';
import { useNavigate } from '~/components/Routing';
import { ProgressReportContextProvider } from './ProgressReportContext';
import { ProgressReportDrawerHeader } from './ProgressReportDrawerHeader';
import { ProgressReportEditDocument } from './ProgressReportEdit.graphql';
import { ProgressReportSidebar } from './ProgressReportSidebar';
import { StartReportPage } from './StartReportPage';
import { StepContainer } from './StepContainer';

interface ProgressReportDrawerProps {
  reportId: string;
}

export const ProgressReportDrawer = ({
  reportId,
}: ProgressReportDrawerProps) => {
  const open = !!useMatch('progress-reports/:id/edit');

  const navigate = useNavigate();

  const { data, error } = useQuery(ProgressReportEditDocument, {
    variables: {
      progressReportId: reportId,
    },
  });
  const report = data?.periodicReport;

  if (
    report?.__typename === 'ProgressReport' &&
    report.status.value === 'NotStarted'
  ) {
    return (
      <ProgressReportContextProvider>
        <CustomDrawer open={open} onClose={() => navigate('../')}>
          <StartReportPage report={report} />
        </CustomDrawer>
      </ProgressReportContextProvider>
    );
  }

  if (error) {
    return (
      <CustomDrawer open={open} onClose={() => navigate('../')}>
        <Error page error={error}>
          {{
            NotFound: 'Could not find progress report',
            Default: 'Error loading progress report',
          }}
        </Error>
      </CustomDrawer>
    );
  }

  if (report && report.__typename !== 'ProgressReport') {
    // Detail page will handle an incorrect type
    return null;
  }

  if (!report) {
    // TODO loading state
    return null;
  }

  return (
    <ProgressReportContextProvider report={report}>
      <CustomDrawer
        open={open}
        onClose={() => navigate('..')}
        sidebar={<ProgressReportSidebar report={report} />}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ProgressReportDrawerHeader report={report} />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <StepContainer report={report} />
        </Box>
      </CustomDrawer>
    </ProgressReportContextProvider>
  );
};

const CustomDrawer = ({
  sidebar,
  children,
  open,
  onClose,
}: {
  sidebar?: ReactNode;
  children: ReactNode;
  open: boolean;
  hideStepper?: boolean;
  onClose?: () => void;
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
        },
      }}
    >
      <Box display="flex" height={1} width={sidebar ? 'calc(100% - 300px)' : 1}>
        <Box
          sx={{
            width: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            pt: 0,
          }}
        >
          {children}
        </Box>
        {sidebar}
      </Box>
    </Drawer>
  );
};
