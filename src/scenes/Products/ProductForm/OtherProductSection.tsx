import React from 'react';
import { TextField } from '../../../components/form';
import { DefaultAccordion } from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';

export const OtherProductSection = ({
  values,
  accordionState,
}: SectionProps) => {
  if (!values.product || values.product.productType !== 'Other') {
    return null;
  }

  return (
    <DefaultAccordion
      name="title"
      {...accordionState}
      title="Title & Description"
      renderCollapsed={() => null}
    >
      <TextField
        name="title"
        label="Title"
        placeholder="Enter product title"
        required
      />

      <TextField
        name="description"
        label="Description"
        placeholder="Optionally enter product description"
        margin="none"
        multiline
        inputProps={{ rowsMin: 2 }}
      />
    </DefaultAccordion>
  );
};
