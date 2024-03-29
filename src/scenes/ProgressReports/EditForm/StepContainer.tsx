import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { flexColumn, StyleProps } from '~/common';
import { useProgressReportContext } from './ProgressReportContext';
import { ReportProp } from './ReportProp';

export const StepContainer = ({ report, ...rest }: ReportProp & StyleProps) => {
  const { CurrentStep } = useProgressReportContext();

  return (
    <Box {...rest} css={flexColumn}>
      <NavButtons css={{ borderBottomStyle: 'solid' }} />
      <Box sx={{ p: 2, mb: 2 }}>
        <CurrentStep report={report} />
      </Box>
      <NavButtons css={{ borderTopStyle: 'solid' }} />
    </Box>
  );
};

const NavButtons = (props: StyleProps) => {
  const { isLast, isFirst, previousStep, nextStep } =
    useProgressReportContext();

  return (
    <Box
      {...props}
      css={(theme) => ({
        display: 'grid',
        justifyContent: 'space-between',
        padding: theme.spacing(1, 0),
        borderWidth: '1px 0',
        borderColor: theme.palette.divider,
      })}
    >
      {!isFirst && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={previousStep}
          startIcon={<ArrowBack />}
        >
          Previous
        </Button>
      )}
      {!isLast && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={nextStep}
          endIcon={<ArrowForward />}
          css={{ gridColumnStart: 2 }}
        >
          Next
        </Button>
      )}
    </Box>
  );
};
