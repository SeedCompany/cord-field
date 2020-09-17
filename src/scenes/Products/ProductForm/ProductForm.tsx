import React from 'react';
import { Form, FormProps, FormSpyRenderProps } from 'react-final-form';
import { ScriptureRange, ScriptureRangeInput } from '../../../api';
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
    values: FormSpyRenderProps['values'],
    prevScriptureReferences: ScriptureRangeInput[] | undefined,
    book: string
  ): ScriptureRangeInput[] => {
    const { updatingScriptures } = values;

    return prevScriptureReferences
      ? [
          ...prevScriptureReferences.filter(
            (scriptureRange) => scriptureRange.start.book !== book
          ),
          ...updatingScriptures,
        ]
      : [...updatingScriptures];
  };

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
            (prevScriptureReferences: ScriptureRange[] | undefined) =>
              parseScriptureRange(
                state.formState.values,
                prevScriptureReferences,
                book
              )
          );
        },
      }}
      //Separating out AccordionSection and passing as render prop so when accordion state gets updated (expand/collapes) the Form doesn't rerender
      children={renderAccordionSection(product)}
    ></Form>
  );
};
