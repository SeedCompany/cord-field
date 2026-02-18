import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
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

const useStyles = makeStyles()(({ spacing }) => ({
  collapsed: {
    marginLeft: spacing(1),
    marginTop: spacing(1),
  },
}));

export const CompletionSection = ({ values, accordionState }: SectionProps) => {
  const { classes } = useStyles();

  if (!values.methodology) {
    return null;
  }

  return (
    <SecuredAccordion
      {...accordionState}
      name="describeCompletion"
      title="Completion Description"
      renderCollapsed={() => (
        <Typography className={classes.collapsed}>
          {values.describeCompletion}
        </Typography>
      )}
    >
      {(props) => (
        <CompletionDescriptionField
          label="Completion means..."
          methodology={values.methodology}
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
