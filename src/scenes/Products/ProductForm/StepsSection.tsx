import { useQuery } from '@apollo/client';
import { ToggleButton } from '@material-ui/lab';
import { intersection } from 'lodash';
import React, { useMemo } from 'react';
import { displayProductStep } from '../../../api';
import { EnumField } from '../../../components/form';
import { AvailableMethodologyStepsDocument as AvailableSteps } from './ProductForm.generated';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const StepsSection = ({ values, accordionState }: SectionProps) => {
  const { methodology, steps } = values.product ?? {};

  const { data } = useQuery(AvailableSteps);

  const availableSteps = useMemo(
    () =>
      data?.methodologyAvailableSteps.find((s) => s.methodology === methodology)
        ?.steps ?? [],
    [methodology, data]
  );

  const selectedSteps = useMemo(
    () => intersection(availableSteps, steps),
    [availableSteps, steps]
  );

  if (availableSteps.length === 0) {
    return null;
  }
  return (
    <SecuredAccordion
      {...accordionState}
      name="steps"
      renderCollapsed={() =>
        selectedSteps.map((step) => (
          <ToggleButton selected key={step} value={step}>
            {displayProductStep(step)}
          </ToggleButton>
        ))
      }
    >
      {(props) => (
        <EnumField
          {...props}
          multiple
          options={availableSteps}
          getLabel={displayProductStep}
          variant="toggle-split"
        />
      )}
    </SecuredAccordion>
  );
};
