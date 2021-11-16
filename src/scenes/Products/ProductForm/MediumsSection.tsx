import { ToggleButton } from '@material-ui/lab';
import React from 'react';
import { displayProductMedium, ProductMediumList } from '../../../api';
import { EnumField } from '../../../components/form';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const MediumsSection = ({ values, accordionState }: SectionProps) => (
  <SecuredAccordion
    {...accordionState}
    title="Distribution Methods"
    name="mediums"
    renderCollapsed={() =>
      values.product?.mediums?.map((medium) => (
        <ToggleButton selected key={medium} value={medium}>
          {displayProductMedium(medium)}
        </ToggleButton>
      ))
    }
  >
    {(props) => (
      <EnumField
        multiple
        options={ProductMediumList}
        getLabel={displayProductMedium}
        variant="toggle-split"
        {...props}
      />
    )}
  </SecuredAccordion>
);
