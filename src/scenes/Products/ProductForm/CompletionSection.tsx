import { Typography } from '@mui/material';
import {
  AutocompleteField,
  AutocompleteFieldProps,
  AutocompleteResult,
  useAutocompleteQuery,
} from '../../../components/form';
import {
  CompletionDescriptionLookupDocument as Lookup,
  CompletionDescriptionLookupQueryVariables as LookupVars,
} from './CompletionDescriptionLookup.graphql';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

export const CompletionSection = ({ values, accordionState }: SectionProps) => {
  if (!values.product?.methodology) {
    return null;
  }

  return (
    <SecuredAccordion
      {...accordionState}
      name="describeCompletion"
      title="Completion Description"
      renderCollapsed={() => (
        <Typography sx={{ ml: 1, mt: 1 }}>
          {values.product?.describeCompletion}
        </Typography>
      )}
    >
      {(props) => (
        <CompletionDescriptionField
          label="Completion means..."
          methodology={values.product?.methodology}
          {...props}
        />
      )}
    </SecuredAccordion>
  );
};

const CompletionDescriptionField = (
  props: Omit<
    AutocompleteFieldProps<string, false, true, true>,
    keyof AutocompleteResult<any, any>
  > &
    LookupVars
) => {
  const data = useAutocompleteQuery(Lookup, {
    variables: (input) => ({
      query: input,
      methodology: props.methodology,
    }),
    listAt: (res) => res.suggestProductCompletionDescriptions.items,
  });

  return (
    <AutocompleteField<string, false, true, true>
      {...props}
      {...data}
      freeSolo
      autoSelect
    />
  );
};
