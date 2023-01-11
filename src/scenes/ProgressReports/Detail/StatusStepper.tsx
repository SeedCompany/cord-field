import {
  Card,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  StepperProps,
} from '@mui/material';
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
      alternativeLabel
      {...rest}
      sx={[{ p: 2 }, ...extendSx(rest.sx)]}
    >
      {Statuses.map((status, index) => (
        <Step key={status}>
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
