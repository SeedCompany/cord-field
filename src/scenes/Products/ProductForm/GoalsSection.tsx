import { ToggleButton, Typography } from '@mui/material';
import { displayProductTypes } from '~/common';
import { EnumField } from '../../../components/form';
import { productTypes } from './constants';
import { DefaultAccordion } from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';

export const GoalsSection = ({
  product,
  values,
  accordionState,
}: SectionProps) => {
  const isEditing = Boolean(product);
  const { productType, producesId: produces } = values.product ?? {};

  return (
    <DefaultAccordion
      name="producesId"
      {...accordionState}
      title="Goal"
      renderCollapsed={() => (
        <>
          {productType && (
            <ToggleButton selected value={produces || ''}>
              {`${displayProductTypes(productType)} ${
                produces?.name.value || ''
              }`}
            </ToggleButton>
          )}
          {!productType && !isEditing && (
            <Typography variant="caption" color="error">
              Goal selection required
            </Typography>
          )}
        </>
      )}
    >
      <EnumField
        name="productType"
        disabled={isEditing}
        options={productTypes}
        getLabel={displayProductTypes}
        defaultValue="DirectScriptureProduct"
        required
        variant="toggle-split"
      />
    </DefaultAccordion>
  );
};
