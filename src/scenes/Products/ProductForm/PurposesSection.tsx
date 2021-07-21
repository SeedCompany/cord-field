import { ToggleButton } from '@material-ui/lab';
import React from 'react';
import { displayProductPurpose, ProductPurposeList } from '../../../api';
import { EnumField } from '../../../components/form';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const PurposesSection = ({ values, accordionState }: SectionProps) => (
  <SecuredAccordion
    {...accordionState}
    name="purposes"
    renderCollapsed={() =>
      values.product?.purposes?.map((purpose) => (
        <ToggleButton selected key={purpose} value={purpose}>
          {displayProductPurpose(purpose)}
        </ToggleButton>
      ))
    }
  >
    {(props) => (
      <EnumField
        multiple
        options={ProductPurposeList}
        getLabel={displayProductPurpose}
        variant="toggle-split"
        {...props}
      />
    )}
  </SecuredAccordion>
);
