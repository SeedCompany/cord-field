import { Box, Drawer } from '@mui/material';
import { useProgressReportContext } from '../../ProgressReportContext';
import { ProgressReportDrawerHeader } from './ProgressReportDrawerHeader';
import { ProgressReportSidebar } from './ProgressReportSidebar';
import { StepContainer } from './StepContainer';

export const ProgressReportDrawer = () => {
  const { progressReportStep, progressReportDrawer, currentReport } =
    useProgressReportContext();

  if (!currentReport) {
    return null;
  }

  return (
    <Drawer
      anchor="right"
      open={progressReportDrawer}
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
            <ProgressReportDrawerHeader report={currentReport} />
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
        <ProgressReportSidebar
          report={currentReport}
          step={progressReportStep}
        />
      </Box>
    </Drawer>
  );
};
