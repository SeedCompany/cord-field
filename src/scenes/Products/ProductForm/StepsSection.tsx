import { useQuery } from '@apollo/client';
import { ToggleButton } from '@material-ui/lab';
import { intersection } from 'lodash';
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

  const { data } = useQuery(AvailableSteps, {
    variables: {
      type: productType === 'Other' ? 'OtherProduct' : productType,
      methodology,
    },
  });
  const availableSteps = data?.availableProductSteps ?? [];

  // When methodology changes, remove all currently selected steps that are now unavailable
  // When steps change, ensure they are ordered by order specified in available steps
  useEffect(() => {
    if (!steps || steps.length === 0) {
      return;
    }

    const orderedAndAvailable = intersection(availableSteps, steps);
    if (orderedAndAvailable.join() !== steps.join()) {
      // @ts-expect-error yes, the field exists.
      form.change('product.steps', orderedAndAvailable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when methodology or steps change
  }, [methodology, steps]);

  if (availableSteps.length === 0) {
    return null;
  }
  return (
    <SecuredAccordion
      {...accordionState}
      name="steps"
      renderCollapsed={() =>
        productType === 'Other' ? (
          <ToggleButton selected value={availableSteps}>
            {displayProductStep(availableSteps[0])}
          </ToggleButton>
        ) : (
          steps?.map((step) => (
            <ToggleButton selected key={step} value={step}>
              {displayProductStep(step)}
            </ToggleButton>
          ))
        )
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
