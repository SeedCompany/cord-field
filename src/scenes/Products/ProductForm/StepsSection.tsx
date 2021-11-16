import { useQuery } from '@apollo/client';
import { ToggleButton } from '@material-ui/lab';
import { intersection } from 'lodash';
import React, { useEffect } from 'react';
import { displayProductStep, ProductStep } from '../../../api';
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

  const { data } = useQuery(AvailableSteps, {
    variables: {
      type: productType === 'Other' ? 'OtherProduct' : productType,
      methodology,
    },
  });
  const availableSteps = data?.availableProductSteps;

  // When available steps changes, remove all currently selected steps that are now unavailable
  useEffect(() => {
    let orderedAndAvailable: readonly ProductStep[] = intersection(
      availableSteps,
      steps
    );
    // If no steps are left over or none have been selected previously,
    // apply all available steps.
    if (orderedAndAvailable.length === 0) {
      orderedAndAvailable = availableSteps ?? [];
    }
    // If new value is different, apply change.
    if (orderedAndAvailable.join() !== steps?.join()) {
      // @ts-expect-error yes, the field exists.
      form.change('product.steps', orderedAndAvailable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when available steps change
  }, [availableSteps]);

  // When steps change, ensure they are ordered by order specified in available steps
  useEffect(() => {
    const ordered = intersection(availableSteps, steps);
    // If new value is different, apply change.
    if (ordered.join() !== steps?.join()) {
      // @ts-expect-error yes, the field exists.
      form.change('product.steps', ordered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when steps change
  }, [steps]);

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
