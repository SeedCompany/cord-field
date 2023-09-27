import {
  Skeleton,
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

type StatusStepperProps = {
  current?: Status | null;
  loading: boolean;
} & StepperProps;

export const StatusStepper = ({
  current,
  loading,
  ...rest
}: StatusStepperProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!loading && !current) {
    return null;
  }
  let currentIndex = current ? Statuses.indexOf(current) : -1;
  // Show last step as done, when on it.
  currentIndex =
    currentIndex === Statuses.length - 1 ? currentIndex + 1 : currentIndex;

  return (
    <Stepper
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
      {Statuses.map((status, index) => {
        const text = loading ? <Skeleton /> : StatusLabels[status];
        return (
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
                {text}
              </StepButton>
            ) : (
              <StepLabel>{text}</StepLabel>
            )}
          </Step>
        );
      })}
    </Stepper>
  );
};
