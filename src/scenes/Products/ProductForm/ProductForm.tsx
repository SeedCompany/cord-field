import React from 'react';
import { Form, FormProps, FormSpyRenderProps } from 'react-final-form';
import { AccordionSection } from './AccordionSection';

interface ProductFormCustomValues {
  productType?: string;
  books?: string;
  startChapter?: string;
  startVerse?: string;
  endChapter?: string;
  endVerse?: string;
}

export const ProductForm = <FormMutationValues extends any>(
  props: FormProps<ProductFormCustomValues & FormMutationValues>
) => {
  const parseScriptureRange = ({
    book,
    startChapter,
    startVerse,
    endChapter,
    endVerse,
  }: FormSpyRenderProps['values']) => ({
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
