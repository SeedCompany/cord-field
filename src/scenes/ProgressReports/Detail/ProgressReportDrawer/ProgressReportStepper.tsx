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
import {
  PromptVariant,
  useProgressReportContext,
} from '../../ProgressReportContext';
import { colorPalette } from './colorPalette';

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

const mapVariantToHeader = (variant: PromptVariant) => {
  switch (variant) {
    case 'Communications Edit':
      return 'Communications';
    case 'FPM Notes':
      return 'Field Project Manager';
    default:
      return variant;
  }
};

export const ProgressReportStepper = ({ step }: ProgressReportStepperProps) => {
  const { setProgressReportStep, promptVariant } = useProgressReportContext();

  return (
    <Paper
      elevation={4}
      sx={{
        marginRight: 2,
        overflow: 'hidden',
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor:
            colorPalette.stepperCard.headerBackground[promptVariant],
        }}
      >
        <PeopleJoinedIcon
          sx={{
            backgroundColor:
              colorPalette.stepperCard.iconBackground[promptVariant],
            marginRight: 1,
            padding: 1,
            height: 48,
            width: 48,
          }}
        />
        <Typography
          sx={{
            padding: 1,
            flexGrow: 2,
          }}
        >
          {mapVariantToHeader(promptVariant)} Steps
        </Typography>
      </div>
      <Box
        sx={{
          padding: 2,
          paddingTop: 1,
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
