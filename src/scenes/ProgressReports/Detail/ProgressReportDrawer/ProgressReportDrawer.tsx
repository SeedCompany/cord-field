import { Box, Drawer } from '@mui/material';
import { useEffect } from 'react';
import { useProgressReportContext } from '../../ProgressReportContext';
import { ProgressReportFragment } from '../ProgressReportDetail.graphql';
import { ProgressReportDrawerHeader } from './ProgressReportDrawerHeader';
import { ProgressReportSidebar } from './ProgressReportSidebar';
import { StepContainer } from './StepContainer';

interface ProgressReportDrawerProps {
  report: ProgressReportFragment | null;
}

export const ProgressReportDrawer = ({ report }: ProgressReportDrawerProps) => {
  const { step, drawerOpen, setCurrentProgressReport, currentReport } =
    useProgressReportContext();

  useEffect(() => {
    if (report?.id !== currentReport?.id) {
      setCurrentProgressReport(report);
    }
  }, [currentReport?.id, report, setCurrentProgressReport]);

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      sx={{
        '& .MuiDrawer-paper': {
          width: 'calc(100% - 200px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', height: 1 }}>
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
            <StepContainer />
          </Box>
        </Box>
        <ProgressReportSidebar report={report} step={step} />
      </Box>
    </Drawer>
  );
};
