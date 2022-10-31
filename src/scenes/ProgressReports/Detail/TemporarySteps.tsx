import { ArrowForward } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Sx } from '~/common';
import { useProgressReportContext } from '../ProgressReportContext';

const typographyLinkSx: Sx = {
  color: 'grey.800',
  fontSize: 14,
  cursor: 'pointer',
  ml: 2,
  '&:hover': {
    textDecoration: 'underline',
  },
};

export const NextButton = () => {
  const { nextProgressReportStep } = useProgressReportContext();

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
      }}
    >
      <Typography
        component="span"
        onClick={nextProgressReportStep}
        sx={typographyLinkSx}
      >
        Next
        <ArrowForward
          sx={{
            ml: 1,
            fontSize: '1rem',
            mb: '-3px',
          }}
        />
      </Typography>
    </div>
  );
};

export const Step0 = () => {
  return (
    <>
      <Typography variant="h2" align="center">
        Team Highlight
      </Typography>

      <NextButton />
    </>
  );
};

export const Step1 = () => (
  <>
    <Typography variant="h2" align="center">
      Community Story
    </Typography>

    <NextButton />
  </>
);

export const Step2 = () => (
  <>
    <Typography variant="h2" align="center">
      Progress
    </Typography>

    <NextButton />
  </>
);

export const Step3 = () => (
  <>
    <Typography variant="h2" align="center">
      Additional Notes
    </Typography>

    <NextButton />
  </>
);
