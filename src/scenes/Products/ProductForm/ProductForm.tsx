import React from 'react';
import { Form, FormProps, FormSpyRenderProps } from 'react-final-form';
import { renderAccordionSection } from './AccordionSection';
import { ProductFormFragment } from './ProductForm.generated';

export interface ProductFormCustomValues {
  product: {
    book?: string;
    productType?: string;
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
  const parseScriptureRange = ({
    product: { book },
    startChapter,
    startVerse,
    endChapter,
    endVerse,
  }: FormSpyRenderProps['values']) => ({
    start: {
      //Need first
      book: book[0],
      chapter: startChapter,
      verse: startVerse,
    },
    end: {
      book: book[0],
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
        setScriptureReferencesField: (_args, state, { changeValue }) => {
          changeValue(
            state,
            'product.scriptureReferences',
            (scriptureReferences) =>
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
      children={renderAccordionSection(product)}
    ></Form>
  );
};
