import { ToggleButton } from '@material-ui/lab';
import React from 'react';
import { ProgressMeasurement, ProgressMeasurementLabels } from '~/api/schema';
import { labelFrom } from '~/common';
import { EnumField } from '../../../components/form';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

const measurementOptions: ProgressMeasurement[] = [
  'Percent',
  'Number',
  'Boolean',
];

export const ProgressMeasurementSection = ({
  values,
  accordionState,
}: SectionProps) => {
  const { progressStepMeasurement, productType } = values.product ?? {};

  if (productType !== 'Other') {
    return null;
  }

  return (
    <SecuredAccordion
      {...accordionState}
      name="progressStepMeasurement"
      title="Progress Measurement"
      renderCollapsed={() =>
        progressStepMeasurement && (
          <ToggleButton selected value={progressStepMeasurement}>
            {ProgressMeasurementLabels[progressStepMeasurement]}
          </ToggleButton>
        )
      }
    >
      {(props) => (
        <EnumField
          required
          options={measurementOptions}
          getLabel={labelFrom(ProgressMeasurementLabels)}
          variant="toggle-split"
          {...props}
        />
      )}
    </SecuredAccordion>
  );
};
