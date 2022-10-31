import {
  Box,
  Paper,
  Step,
  StepButton,
  StepConnector,
  Stepper,
  Typography,
} from '@mui/material';
import { Sx } from '~/common';
import { useProgressReportContext } from '../../ProgressReportContext';

interface ProgressReportStepperProps {
  step: number;
}

const stepperSx: Sx = (theme) => ({
  '&': {
    '.MuiStep-root': {
      cursor: 'pointer',

      '.MuiStepLabel-label': {
        fontSize: '0.75rem',
      },

      '.MuiStepIcon-root': {
        color: theme.palette.grey[500],
        '&.Mui-active': {
          color: theme.palette.info.light,
        },
        '&.Mui-completed': {
          color: theme.palette.grey[500],
          backgroundColor: theme.palette.grey[500],
          borderRadius: '50%',
        },
      },
    },
    '.MuiStepConnector-lineVertical': {
      minHeight: 16,
    },
    '.MuiStepLabel-root': {
      paddingTop: 0.5,
      paddingBottom: 0.5,
    },
  },
});

const typographySx: Sx = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  marginTop: 1,
  marginBottom: 1,
};

const singleConnectorSx: Sx = {
  '&.MuiStepConnector-root': {
    flex: '1 1 auto',
    marginLeft: '12px',
  },
  '& .MuiStepConnector-lineHorizontal': {
    display: 'block',
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    borderTop: 'none',
    minHeight: 16,
  },
};

export const ProgressReportStepper = ({ step }: ProgressReportStepperProps) => {
  const { setProgressReportStep } = useProgressReportContext();

  return (
    <Paper elevation={4} sx={{ mr: 2, overflow: 'hidden' }}>
      <div>
        <Typography sx={{ px: 2, pt: 2 }}>Steps:</Typography>
      </div>
      <Box sx={{ p: 2, pt: 0 }}>
        <Typography sx={typographySx}>Narrative Report</Typography>
        <Stepper activeStep={step} orientation="vertical" sx={stepperSx}>
          <Step onClick={() => setProgressReportStep(0)}>
            <StepButton icon={' '}>Team highlight</StepButton>
          </Step>
          <Step onClick={() => setProgressReportStep(1)}>
            <StepButton icon={' '}>Community Story</StepButton>
          </Step>
        </Stepper>
        <StepConnector sx={singleConnectorSx} />
        <Typography sx={typographySx}>Project Management</Typography>
        <Stepper activeStep={step - 2} orientation="vertical" sx={stepperSx}>
          <Step onClick={() => setProgressReportStep(2)}>
            <StepButton icon={' '}>Progress</StepButton>
          </Step>
        </Stepper>
        <StepConnector sx={singleConnectorSx} />
        <Typography sx={typographySx}>Final Details</Typography>
        <Stepper activeStep={step - 3} orientation="vertical" sx={stepperSx}>
          <Step onClick={() => setProgressReportStep(3)}>
            <StepButton icon={' '}>Additional Notes</StepButton>
          </Step>
        </Stepper>
      </Box>
    </Paper>
  );
};
