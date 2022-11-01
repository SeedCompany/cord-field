import { ArrowForward } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Sx } from '~/common';
import { useProgressReportContext } from '../../../ProgressReportContext';

const typographyLinkSx: Sx = (theme) => ({
  color: theme.palette.grey[800],
  fontSize: 14,
  cursor: 'pointer',
  marginLeft: 2,
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const NextStepButton = () => {
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
            marginLeft: 1,
            fontSize: '1rem',
            marginBottom: '-3px',
          }}
        />
      </Typography>
    </div>
  );
};
