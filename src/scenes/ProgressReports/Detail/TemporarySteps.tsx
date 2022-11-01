import { Typography } from '@mui/material';
import { NextStepButton } from './ProgressReportDrawer/Steps/NextStepButton';

export const Step0 = () => {
  return (
    <>
      <Typography variant="h2" align="center">
        Team Highlight
      </Typography>

      <NextStepButton />
    </>
  );
};

export const Step1 = () => (
  <>
    <Typography variant="h2" align="center">
      Community Story
    </Typography>

    <NextStepButton />
  </>
);

export const Step2 = () => (
  <>
    <Typography variant="h2" align="center">
      Progress
    </Typography>

    <NextStepButton />
  </>
);

export const Step3 = () => (
  <>
    <Typography variant="h2" align="center">
      Additional Notes
    </Typography>

    <NextStepButton />
  </>
);
