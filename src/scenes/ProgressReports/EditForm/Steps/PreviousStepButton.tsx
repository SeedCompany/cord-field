import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import { StyleProps } from '~/common';
import { useProgressReportContext } from '../ProgressReportContext';

export const PreviousStepButton = ({ sx }: StyleProps) => {
  const { previousStep } = useProgressReportContext();

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'flex-start',
      }}
    >
      <Button
        sx={sx}
        onClick={previousStep}
        variant="text"
        color="secondary"
        startIcon={
          <ArrowBack
            sx={{
              marginBottom: '-3px',
            }}
          />
        }
      >
        Previous
      </Button>
    </div>
  );
};
