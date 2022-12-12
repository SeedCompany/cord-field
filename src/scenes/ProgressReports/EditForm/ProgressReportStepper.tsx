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
import { useProgressReportContext } from './ProgressReportContext';

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
  const { setProgressReportStep, steps, flatSteps } =
    useProgressReportContext();
  let totalSteps = -1;

  return (
    <Paper elevation={4} sx={{ mr: 2, borderRadius: 0.6 }}>
      <div>
        <Typography sx={{ p: 2, pt: 3 }}>Steps:</Typography>
      </div>
      <Box sx={{ p: 2, pt: 0 }}>
        {Object.entries(steps).map(([title, steps]) => {
          return (
            <div key={title}>
              <Typography sx={typographySx}>{title}</Typography>
              <Stepper
                activeStep={step - totalSteps - 1}
                orientation="vertical"
                sx={stepperSx}
              >
                {steps.map((label) => {
                  totalSteps += 1;
                  const stepIndex = totalSteps;

                  return (
                    <Step
                      key={label}
                      onClick={() => setProgressReportStep(stepIndex)}
                    >
                      <StepButton icon={' '}>{label}</StepButton>
                    </Step>
                  );
                })}
              </Stepper>
              {totalSteps !== flatSteps.length - 1 && (
                <StepConnector sx={singleConnectorSx} />
              )}
            </div>
          );
        })}
      </Box>
    </Paper>
  );
};
