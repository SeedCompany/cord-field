import {
  Box,
  Paper,
  Step,
  StepButton,
  StepConnector,
  Stepper,
  Theme,
  Typography,
} from '@mui/material';
import { PeopleJoinedIcon } from '~/components/Icons';
import { useProgressReportContext } from '../../ProgressReportContext';

interface ProgressReportStepperProps {
  step: number;
}

const stepperSx = (theme: Theme) => ({
  '& .MuiStep-root .MuiStepLabel-label': {
    fontSize: '0.75rem',
  },
  '& .MuiStep-root': {
    cursor: 'pointer',
  },
  '& .MuiStep-root .MuiStepIcon-root ': {
    color: theme.palette.grey[500],
  },
  '& .MuiStep-root .MuiStepIcon-root.Mui-active': {
    color: theme.palette.info.light,
  },
  '& .MuiStep-root .MuiStepIcon-root.Mui-completed': {
    color: theme.palette.grey[500],
    backgroundColor: theme.palette.grey[500],
    borderRadius: '50%',
  },
  '& .MuiStepConnector-lineVertical': {
    minHeight: 16,
  },
  '& .MuiStepLabel-root': {
    paddingTop: 0.5,
    paddingBottom: 0.5,
  },
});

const typographySx = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  marginTop: 1,
  marginBottom: 1,
};

const singleConnectorSx = {
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
    <Paper
      elevation={4}
      sx={{
        marginRight: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#E0F7FA',
        }}
      >
        <PeopleJoinedIcon
          sx={{
            backgroundColor: '#B2EBF2',
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
          Partner Steps
        </Typography>
      </Box>
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
            <StepButton icon={' '}>Comments</StepButton>
          </Step>
        </Stepper>
      </Box>
    </Paper>
  );
};
