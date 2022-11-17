import { useQuery } from '@apollo/client';
import { Box, Drawer, Typography } from '@mui/material';
import { useMatch } from 'react-router-dom';
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

  const { data } = useQuery(ProgressReportEditDocument, {
    variables: {
      progressReportId: reportId,
    },
  });

  if (data?.periodicReport.__typename !== 'ProgressReport') {
    return (
      <Typography color="error">
        This is not the correct type of progress report
      </Typography>
    );
  }

  return (
    <ProgressReportContextProvider report={data.periodicReport}>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => navigate('..')}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
          },
        }}
      >
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
          </Box>
          <ProgressReportSidebar />
        </Box>
      </Drawer>
    </ProgressReportContextProvider>
  );
};