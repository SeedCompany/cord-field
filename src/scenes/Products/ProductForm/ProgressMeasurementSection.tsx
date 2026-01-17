import { ToggleButton } from '@mui/material';
import {
  ProgressMeasurement,
  ProgressMeasurementLabels,
} from '~/api/schema.graphql';
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
  const { progressStepMeasurement, productType } = values;

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
