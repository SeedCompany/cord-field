import { Box, Card, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { ProgressReportStatus } from '~/api/schema.graphql';
import { Sx } from '~/common';
import { Link } from '~/components/Routing';
import { ProgressReportEditFragment } from '../EditForm/ProgressReportEdit.graphql';

const statuses = [
  'NotStarted',
  'InProgress',
  'PendingTranslation',
  'InReview',
  'Approved',
  'Published',
] as ProgressReportStatus[];

// Convert PascalCase to Title Case
const titleCase = (str: string) =>
  str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

interface Props {
  report: ProgressReportEditFragment;
}

const stepperSx: Sx = (theme) => ({
  '&': {
    '.MuiStepIcon-root': {
      color: theme.palette.grey[500],
      '&.Mui-active': {
        color: theme.palette.info.light,
      },
      '&.Mui-completed': {
        color: theme.palette.info.light,
        backgroundColor: 'white',
      },
    },
  },
});

export const StatusStepper = ({ report }: Props) => {
  return (
    <Card
      sx={{
        p: 2,
        pb: 1,
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stepper
        activeStep={statuses.indexOf(report.status.value!)}
        alternativeLabel
        sx={stepperSx}
      >
        {statuses.map((status) => {
          const completed =
            statuses.indexOf(status) < statuses.indexOf(report.status.value!);
          const icon = completed ? undefined : ' ';

          return (
            <Step key={status} completed={completed}>
              <StepLabel icon={icon}>{titleCase(status)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider',
          p: 1,
        }}
      >
        <Link to="edit" variant="caption" fontWeight="bold">
          View
        </Link>
        <Typography variant="caption">Updated at</Typography>
      </Box>
    </Card>
  );
};
