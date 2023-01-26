import { ArrowForward } from '@mui/icons-material';
import { Button } from '@mui/material';
import { StyleProps } from '~/common';
import { useProgressReportContext } from '../ProgressReportContext';

export const NextStepButton = ({ sx }: StyleProps) => {
  const { nextStep } = useProgressReportContext();

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Button
        sx={sx}
        onClick={nextStep}
        variant="outlined"
        color="secondary"
        endIcon={
          <ArrowForward
            sx={{
              marginBottom: '-3px',
            }}
          />
        }
      >
        Next
      </Button>
    </div>
  );
};
