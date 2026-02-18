import { ToggleButton } from '@mui/material';
import { ProductMediumLabels, ProductMediumList } from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { EnumField } from '../../../components/form';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const MediumsSection = ({ values, accordionState }: SectionProps) => (
  <SecuredAccordion
    {...accordionState}
    title="Distribution Methods"
    name="mediums"
    renderCollapsed={() =>
      values.mediums?.map((medium) => (
        <ToggleButton selected key={medium} value={medium}>
          {ProductMediumLabels[medium]}
        </ToggleButton>
      ))
    }
  >
    {(props) => (
      <EnumField
        multiple
        options={ProductMediumList}
        getLabel={labelFrom(ProductMediumLabels)}
        variant="toggle-split"
        {...props}
      />
    )}
  </SecuredAccordion>
);
