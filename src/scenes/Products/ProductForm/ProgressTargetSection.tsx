import { Typography } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React from 'react';
import { NumberField } from '../../../components/form';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const ProgressTargetSection = ({
  values,
  accordionState,
}: SectionProps) => {
  const { progressStepMeasurement, progressTarget } = values.product ?? {};

  if (progressStepMeasurement !== 'Number') {
    return null;
  }

  return (
    <SecuredAccordion
      {...accordionState}
      name="progressTarget"
      title={() => <Typography variant="h4">Progress Target</Typography>}
      renderCollapsed={() =>
        progressTarget && (
          <ToggleButton selected value={progressTarget}>
            {progressTarget}
          </ToggleButton>
        )
      }
    >
      {(props) => <NumberField required label="Progress Target" {...props} />}
    </SecuredAccordion>
  );
};
