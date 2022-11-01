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
import { PeopleJoinedIcon } from '~/components/Icons';
import { useProgressReportContext } from '../../ProgressReportContext';
import { colorPalette } from './colorPalette';

interface ProgressReportStepperProps {
  step: number;
}

const stepperSx: Sx = {
  '&': {
    '.MuiStep-root': {
      cursor: 'pointer',

      '.MuiStepLabel-label': {
        fontSize: '0.75rem',
      },

      '.MuiStepIcon-root': {
        color: 'grey.500',
        '&.Mui-active': {
          color: 'info.light',
        },
        '&.Mui-completed': {
          color: 'grey.500',
          bgcolor: 'grey.500',
          borderRadius: '50%',
        },
      },
    },
    '.MuiStepConnector-lineVertical': {
      minHeight: 16,
    },
    '.MuiStepLabel-root': {
      pt: 0.5,
      pb: 0.5,
    },
  },
};

const typographySx: Sx = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  mt: 1,
  mb: 1,
};

const singleConnectorSx: Sx = {
  '&.MuiStepConnector-root': {
    flex: '1 1 auto',
    ml: '12px',
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
    <Paper
      elevation={4}
      sx={{
        mr: 2,
        overflow: 'hidden',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: colorPalette.stepperCard.headerBackground.partner,
        }}
      >
        <PeopleJoinedIcon
          sx={{
            bgcolor: colorPalette.stepperCard.iconBackground.partner,
            mr: 1,
            p: 1,
            height: 48,
            width: 48,
          }}
        />
        <Typography
          sx={{
            p: 1,
            flexGrow: 2,
          }}
        >
          Partner Steps
        </Typography>
      </div>
      <Box
        sx={{
          p: 2,
          pt: 1,
        }}
      >
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
