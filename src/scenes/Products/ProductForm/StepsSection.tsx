import { useQuery } from '@apollo/client';
import { ToggleButton } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { displayProductStep } from '../../../api';
import { EnumField } from '../../../components/form';
import { AvailableProductStepsDocument as AvailableSteps } from './ProductForm.generated';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const StepsSection = ({
  form,
  values,
  accordionState,
}: SectionProps) => {
  const { methodology, steps, productType } = values.product ?? {};

  const { data, previousData } = useQuery(AvailableSteps, {
    variables: {
      type: productType === 'Other' ? 'OtherProduct' : productType,
      methodology,
    },
  });
  const availableSteps = data?.availableProductSteps;
  const prevSteps = previousData?.availableProductSteps;
  useEffect(() => {
    // When available steps changes, remove all currently selected steps that are now unavailable and set all available steps
    // @ts-expect-error yes, the field exists.
    form.change('product.steps', availableSteps);
    // All goal steps are selected when editing a goal
    if (!prevSteps) {
      // @ts-expect-error yes, the field exists.
      form.change('product.steps', steps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when steps change
  }, [availableSteps]);

  if (!availableSteps || availableSteps.length === 0) {
    return null;
  }
  return (
    <SecuredAccordion
      {...accordionState}
      name="steps"
      renderCollapsed={() =>
        steps?.map((step) => (
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
