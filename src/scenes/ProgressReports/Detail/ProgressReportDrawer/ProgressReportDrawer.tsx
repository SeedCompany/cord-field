import { useQuery } from '@apollo/client';
import { Box, Drawer } from '@mui/material';
import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { useNavigate } from '~/components/Routing';
import { useProgressReportContext } from '../../ProgressReportContext';
import { ProgressReportEditDocument } from './ProgressReportDrawer.graphql';
import { ProgressReportDrawerHeader } from './ProgressReportDrawerHeader';
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
  const { setCurrentProgressReport } = useProgressReportContext();

  const { data } = useQuery(ProgressReportEditDocument, {
    variables: {
      progressReportId: reportId,
    },
  });

  useEffect(() => {
    if (data?.periodicReport.__typename === 'ProgressReport') {
      setCurrentProgressReport(data.periodicReport);
    }
  }, [data, setCurrentProgressReport]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => navigate('..')}
      sx={{
        '& .MuiDrawer-paper': {
          width: 'calc(100% - 200px)',
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
  );
};
