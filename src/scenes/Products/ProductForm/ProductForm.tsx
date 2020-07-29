import React, { FC } from 'react';
import { Form, FormProps } from 'react-final-form';
import { AccordionSection } from './AccordionSection';

type ProductFormProps = Pick<FormProps, 'onSubmit'> & {
  initialValues?: any;
};

export const ProductForm: FC<ProductFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const parseScriptureRange = ({
    books: [book],
    startChapter,
    startVerse,
    endChapter,
    endVerse,
  }: any) => ({
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
      initialValues={initialValues}
      onSubmit={onSubmit}
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
      render={AccordionSection}
    ></Form>
  );
};
