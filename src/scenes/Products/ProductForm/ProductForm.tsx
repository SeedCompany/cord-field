import React from 'react';
import { Form, FormProps, FormSpyRenderProps } from 'react-final-form';
import { Except } from 'type-fest';
import { CreateProduct, ProductMethodology } from '../../../api';
import { AccordionSection } from './AccordionSection';

export type ProductFormValues = Except<CreateProduct, 'methodology'> & {
  productType?: string[];
  books?: string[];
  startChapter?: string;
  startVerse?: string;
  endChapter?: string;
  endVerse?: string;
  methodology?: ProductMethodology[];
};

export const ProductForm = (props: FormProps<ProductFormValues>) => {
  const parseScriptureRange = ({
    books,
    startChapter,
    startVerse,
    endChapter,
    endVerse,
  }: FormSpyRenderProps['values']) => ({
    start: {
      book: books?.[0],
      chapter: startChapter,
      verse: startVerse,
    },
    end: {
      book: books?.[0],
      chapter: endChapter,
      verse: endVerse,
    },
  });

  return (
    <Form
      {...props}
      mutators={{
        clear: (fieldNames, state, { changeValue }) => {
          fieldNames.forEach((name: string) =>
            changeValue(state, name, () => undefined)
          );
        },
        setScriptureReferencesField: (_args, state, { changeValue }) => {
          changeValue(state, 'scriptureReferences', (scriptureReferences) =>
            scriptureReferences
              ? [
                  ...scriptureReferences,
                  parseScriptureRange(state.formState.values),
                ]
              : [parseScriptureRange(state.formState.values)]
          );
        },
      }}
      //Separating out AccordionSection and passing as render prop so when accordion state gets updated (expand/collapes) the Form doesn't rerender
      children={AccordionSection}
    ></Form>
  );
};
