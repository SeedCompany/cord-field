import { ToggleButton } from '@mui/material';
import {
  ProgressMeasurement,
  ProgressMeasurementLabels,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { EnumField } from '../../../components/form';
import { ProductTypes } from './constants';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

const measurementOptions: ProgressMeasurement[] = [
  'Percent',
  'Number',
  'Boolean',
];

const measurableTypes: ProductTypes[] = ['Other', 'EthnoArt'];

export const ProgressMeasurementSection = ({
  values,
  accordionState,
}: SectionProps) => {
  const { progressStepMeasurement, productType } = values;

  if (!productType || !measurableTypes.includes(productType)) {
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
