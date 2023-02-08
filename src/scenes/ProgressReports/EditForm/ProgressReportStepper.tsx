import {
  Paper,
  Step,
  StepButton,
  StepConnector,
  Stepper,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';
import { Sx } from '~/common';
import { useProgressReportContext } from './ProgressReportContext';

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
  const { setProgressReportStep, groupedStepMap, CurrentStep } =
    useProgressReportContext();

  return (
    <Paper
      elevation={4}
      sx={{ p: 2 }}
      component="nav"
      aria-label="Quarterly Report Steps"
    >
      <Typography component="h3" paragraph aria-hidden>
        Steps:
      </Typography>
      {Object.entries(groupedStepMap).map(([title, steps], index) => (
        <Fragment key={title}>
          {index > 0 && <StepConnector sx={singleConnectorSx} />}
          <Typography component="h4" sx={typographySx}>
            {title}
          </Typography>
          <Stepper orientation="vertical" sx={stepperSx}>
            {steps.map(([label, StepComp]) => (
              <Step
                key={label}
                onClick={() => setProgressReportStep(label)}
                active={StepComp === CurrentStep}
                disabled={StepComp === CurrentStep}
              >
                <StepButton
                  icon={' '}
                  aria-current={StepComp === CurrentStep ? 'step' : undefined}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Fragment>
      ))}
    </Paper>
  );
};
