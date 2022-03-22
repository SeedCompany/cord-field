import React from 'react';
import { TextField } from '../../../components/form';
import { DefaultAccordion } from './DefaultAccordion';
import { SectionProps } from './ProductFormFields';

export const PlaceholderDescriptionSection = ({
  accordionState,
}: SectionProps) => {
  return (
    <DefaultAccordion
      name="placeholderDescription"
      {...accordionState}
      title="Placeholder Description"
      renderCollapsed={() => <></>}
    >
      <TextField
        name="placeholderDescription"
        label="Placeholder"
        placeholder="Enter placeholder description"
      />
    </DefaultAccordion>
  );
};
