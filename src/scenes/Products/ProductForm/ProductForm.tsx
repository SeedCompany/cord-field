import React from 'react';
import { Form, FormProps, FormSpyRenderProps } from 'react-final-form';
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
  const parseScriptureRange = (
    {
      startChapter,
      startVerse,
      endChapter,
      endVerse,
    }: FormSpyRenderProps['values'],
    book: string
  ) => ({
    start: {
      book,
      chapter: startChapter,
      verse: startVerse,
    },
    end: {
      book,
      chapter: endChapter,
      verse: endVerse,
    },
  });

  return (
    <Form<FormMutationValues>
      {...formProps}
      mutators={{
        clear: (fieldNames, state, { changeValue }) => {
          fieldNames.forEach((name: string) =>
            changeValue(state, name, () => undefined)
          );
        },
        setScriptureReferencesField: ([book], state, { changeValue }) => {
          changeValue(
            state,
            'product.scriptureReferences',
            (scriptureReferences) =>
              scriptureReferences
                ? [
                    ...scriptureReferences,
                    parseScriptureRange(state.formState.values, book),
                  ]
                : [parseScriptureRange(state.formState.values, book)]
          );
        },
      }}
      //Separating out AccordionSection and passing as render prop so when accordion state gets updated (expand/collapes) the Form doesn't rerender
      children={renderAccordionSection(product)}
    ></Form>
  );
};
