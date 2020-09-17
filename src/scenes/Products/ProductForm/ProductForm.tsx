import React from 'react';
import { Form, FormProps } from 'react-final-form';
import {
  FilmLookupItem,
  LiteracyMaterialLookupItem,
  SongLookupItem,
  StoryLookupItem,
} from '../../../components/form/Lookup';
import { renderAccordionSection } from './AccordionSection';
import { ProductFormFragment } from './ProductForm.generated';

export interface ProductFormCustomValues {
  product: {
    book?: string;
    productType?: string;
    produces?:
      | FilmLookupItem
      | StoryLookupItem
      | LiteracyMaterialLookupItem
      | SongLookupItem;
  };
  startChapter?: string;
  startVerse?: string;
  endChapter?: string;
  endVerse?: string;
}

export const ProductForm = <FormMutationValues extends any>({
  product,
  ...formProps
}: FormProps<FormMutationValues> & {
  product?: ProductFormFragment;
}) => {
  return (
    <Form<FormMutationValues>
      {...formProps}
      children={renderAccordionSection(product)}
    ></Form>
  );
};
