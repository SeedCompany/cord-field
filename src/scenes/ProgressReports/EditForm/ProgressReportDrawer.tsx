import { Box, Drawer } from '@mui/material';
import { ReactNode } from 'react';
import { useMatch } from 'react-router-dom';
import { useNavigate } from '~/components/Routing';
import { ProgressReportContextProvider } from './ProgressReportContext';
import { ProgressReportDrawerHeader } from './ProgressReportDrawerHeader';
import { ProgressReportEditFragment } from './ProgressReportEdit.graphql';
import { ProgressReportSidebar } from './ProgressReportSidebar';
import { StartReportPage } from './StartReportPage';
import { StepContainer } from './StepContainer';

interface ProgressReportDrawerProps {
  report: ProgressReportEditFragment;
}

export const ProgressReportDrawer = ({ report }: ProgressReportDrawerProps) => {
  const open = !!useMatch('progress-reports/:id/edit');

  const navigate = useNavigate();
  if (report.status.value === 'NotStarted') {
    return (
      <ProgressReportContextProvider report={report}>
        <CustomDrawer open={open} onClose={() => navigate('../')} hideStepper>
          <StartReportPage />
        </CustomDrawer>
      </ProgressReportContextProvider>
    );
  }

  return (
    <ProgressReportContextProvider report={report}>
      <CustomDrawer open={open} onClose={() => navigate('..')}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ProgressReportDrawerHeader />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <StepContainer />
        </Box>
      </CustomDrawer>
    </ProgressReportContextProvider>
  );
};

const CustomDrawer = ({
  children,
  open,
  hideStepper,
  onClose,
}: {
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
      <Box
        sx={[
          { display: 'flex', height: 1, width: 'calc(100% - 300px)' },
          !!hideStepper && {
            width: '100%',
          },
        ]}
      >
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
        {hideStepper ? null : <ProgressReportSidebar />}
      </Box>
    </Drawer>
  );
};
