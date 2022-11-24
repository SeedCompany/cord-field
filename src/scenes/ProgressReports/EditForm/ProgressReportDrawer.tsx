import { useQuery } from '@apollo/client';
import { Box, Drawer, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useMatch } from 'react-router-dom';
import { Error } from '~/components/Error';
import { useNavigate } from '~/components/Routing';
import { ProgressReportContextProvider } from './ProgressReportContext';
import { ProgressReportDrawerHeader } from './ProgressReportDrawerHeader';
import { ProgressReportEditDocument } from './ProgressReportEdit.graphql';
import { ProgressReportSidebar } from './ProgressReportSidebar';
import { StepContainer } from './StepContainer';

interface ProgressReportDrawerProps {
  reportId?: string;
}

export const ProgressReportDrawer = ({
  reportId = '',
}: ProgressReportDrawerProps) => {
  const open = !!useMatch('progress-reports/:id/edit');

  const navigate = useNavigate();

  const { data, error } = useQuery(ProgressReportEditDocument, {
    variables: {
      progressReportId: reportId,
    },
  });

  if (error) {
    return (
      <CustomDrawer open={open} onClose={() => navigate('../')}>
        <ProgressReportDrawerHeader />
        <Error page error={error}>
          {{
            NotFound: 'Could not find progress report',
            Default: 'Error loading progress report',
          }}
        </Error>
      </CustomDrawer>
    );
  }

  if (data?.periodicReport.__typename !== 'ProgressReport') {
    return (
      <Typography color="error">
        This is not the correct type of progress report
      </Typography>
    );
  }

  return (
    <ProgressReportContextProvider report={data.periodicReport}>
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
  onClose,
}: {
  children: ReactNode;
  open: boolean;
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
      {' '}
      <Box sx={{ display: 'flex', height: 1, width: 'calc(100% - 300px)' }}>
        <Box
          sx={{
            width: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            pt: 4,
          }}
        >
          {children}
        </Box>
        <ProgressReportSidebar />
      </Box>
    </Drawer>
  );
};
