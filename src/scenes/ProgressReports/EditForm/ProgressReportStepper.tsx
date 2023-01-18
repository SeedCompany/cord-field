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
import { Steps } from './Steps';

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

export const ProgressReportStepper = () => {
  const { setProgressReportStep, stepName } = useProgressReportContext();

  return (
    <Paper elevation={4} sx={{ mr: 2, borderRadius: 0.6 }}>
      <div>
        <Typography sx={{ p: 2, pt: 3 }}>Steps:</Typography>
      </div>
      <Box sx={{ p: 2, pt: 0 }}>
        {Object.entries(Steps).map(([title, steps], index) => (
          <div key={title}>
            {index > 0 && <StepConnector sx={singleConnectorSx} />}
            <Typography sx={typographySx}>{title}</Typography>
            <Stepper orientation="vertical" sx={stepperSx}>
              {steps.map(([label]) => (
                <Step
                  key={label}
                  onClick={() => setProgressReportStep(label)}
                  active={stepName === label}
                >
                  <StepButton icon={' '}>{label}</StepButton>
                </Step>
              ))}
            </Stepper>
          </div>
        ))}
      </Box>
    </Paper>
  );
};
