import { Typography } from '@material-ui/core';
import React from 'react';
import { TextField } from '../../../components/form';
import { required } from '../../../components/form/validators';
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
      name="produces"
      {...accordionState}
      title={() => <Typography variant="h4">Title & Description</Typography>}
      renderCollapsed={() => <></>}
    >
      <TextField
        name="title"
        label="Title"
        placeholder="Enter product title"
        required
        validate={[required]}
        margin="none"
      />

      <TextField
        name="description"
        label="Description"
        placeholder="(Optional) Enter product description"
        margin="none"
      />
    </DefaultAccordion>
  );
};
