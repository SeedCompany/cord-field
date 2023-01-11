import {
  Card,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  StepperProps,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link } from 'react-router-dom';
import {
  ProgressReportStatusList as Statuses,
  ProgressReportStatusLabels as StatusLabels,
} from '~/api/schema/enumLists';
import { ProgressReportStatus as Status } from '~/api/schema/schema.graphql';
import { extendSx } from '~/common';

type StatusStepperProps = { current?: Status | null } & StepperProps;

export const StatusStepper = ({ current, ...rest }: StatusStepperProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!current) {
    return null;
  }
  let currentIndex = Statuses.indexOf(current);
  // Show last step as done, when on it.
  currentIndex =
    currentIndex === Statuses.length - 1 ? currentIndex + 1 : currentIndex;

  return (
    <Stepper
      component={Card}
      activeStep={currentIndex}
      alternativeLabel={!mobile}
      orientation={mobile ? 'vertical' : 'horizontal'}
      {...rest}
      sx={[
        {
          '&.MuiStepper-vertical': { p: 1 },
          '&.MuiStepper-horizontal': { px: 1 },

          alignItems: 'stretch', // Stretch items for Buttons
          '.MuiStepConnector-lineVertical': {
            minHeight: theme.spacing(2),
          },
        },
        ...extendSx(rest.sx),
      ]}
    >
      {Statuses.map((status, index) => (
        <Step
          key={status}
          sx={{
            '&.MuiStep-horizontal': { my: 2 },
            // Make Button same height as the card (needs stretch above)
            '&.MuiStep-horizontal .MuiStepButton-root': {
              height: 1,
              '.MuiStepLabel-root': { height: 1 },
            },
          }}
        >
          {index === currentIndex ? (
            // Not sure how useful this is, but I wanted to start something.
            // I think more interactivity could happen here in the future.
            // Maybe workflow events could be integrated here as well.
            <StepButton component={Link} to="edit">
              {StatusLabels[status]}
            </StepButton>
          ) : (
            <StepLabel>{StatusLabels[status]}</StepLabel>
          )}
        </Step>
      ))}
    </Stepper>
  );
};
