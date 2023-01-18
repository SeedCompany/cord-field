import { Grid, Typography } from '@mui/material';
import { setIn } from 'final-form';
import { useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Except } from 'type-fest';
import { defaultHandlers } from '~/api';
import {
  CreateLanguage,
  SensitivityList,
  UpdateLanguage,
} from '~/api/schema.graphql';
import { canReadAny, Nullable } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  AlphaLowercaseField,
  CheckboxField,
  FieldGroup,
  FormattedTextField,
  FormattedTextFieldProps,
  matchFieldIfSame,
  NumberField,
  SecuredField,
  SelectField,
  SubmitError,
  TextField,
  YearField,
} from '../../../components/form';
import { max, minLength, required } from '../../../components/form/validators';
import { useNumberFormatter } from '../../../components/Formatters';
import { LanguageListItemFragment } from '../../../components/LanguageListItemCard/LanguageListItem.graphql';
import { LanguageFormFragment } from './LangugeForm.graphql';

type LanguageMutation = UpdateLanguage | CreateLanguage;

export interface LanguageFormValues<Mutation extends LanguageMutation> {
  language: Except<Mutation, 'sponsorEstimatedEndDate'> & {
    sponsorEstimatedEndFY?: Nullable<number>;
  };
}

export type LanguageFormProps<Mutation extends LanguageMutation> =
  DialogFormProps<LanguageFormValues<Mutation>, LanguageListItemFragment> & {
    /** The pre-existing language to edit */
    language?: LanguageFormFragment;
  };

const useStyles = makeStyles()(() => ({
  content: {
    overflow: 'hidden', // prevent scroll bars from negative margins of Grid
  },
}));

const decorators = [
  ...DialogForm.defaultDecorators,
  matchFieldIfSame(`language.name`, `language.displayName`),
];

export const LanguageForm = <Mutation extends LanguageMutation>({
  language,
  ...rest
}: LanguageFormProps<Mutation>) => {
  const { classes } = useStyles();
  const formatNumber = useNumberFormatter();
  const maxPopulation = useMemo(
    () =>
      max(
        2_000_000_000 - 1,
        `Choose value below ${formatNumber(2_000_000_000)}`
      ),
    [formatNumber]
  );

  return (
    <DialogForm
      DialogProps={{
        maxWidth: 'lg',
      }}
      {...rest}
      decorators={decorators}
      fieldsPrefix="language"
      errorHandlers={{
        Input: (e, next, util) =>
          e.field === 'language.hasExternalFirstScripture'
            ? setIn(
                {},
                e.field,
                'Language already has an engagement which claims first Scripture'
              )
            : defaultHandlers.Input(e, next, util),
      }}
    >
      {({ values }: { values: Partial<LanguageFormValues<Mutation>> }) => {
        return (
          <Grid container spacing={3} className={classes.content}>
            <Grid item xs={12}>
              <SubmitError align="left" />
            </Grid>
            {canReadAny(
              language,
              true,
              'name',
              'displayName',
              'displayNamePronunciation',
              'registryOfDialectsCode',
              'populationOverride',
              'isDialect'
            ) && (
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  Info
                </Typography>
                <Grid container spacing={2}>
                  <SecuredField obj={language} name="name">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Name"
                          placeholder="Enter Name"
                          required
                          validate={[required, minLength()]}
                          margin="none"
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="displayName">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Public Name"
                          placeholder="Enter Public Name"
                          required
                          validate={[required, minLength()]}
                          margin="none"
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="displayNamePronunciation">
                    {(props) => (
                      <Grid item xs={12}>
                        <TextField
                          label="Pronunciation Guide"
                          placeholder="Enter Pronunciation of Public Name"
                          margin="none"
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="registryOfDialectsCode">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <FormattedTextField
                          label="Registry Of Dialects Code"
                          placeholder="#####"
                          accept={/\d/g}
                          formatInput={(value) =>
                            (value.match(/\d+/g) || []).join('').slice(0, 5)
                          }
                          validate={(value) =>
                            !value || value.length === 5
                              ? undefined
                              : `Must be 5 digits`
                          }
                          margin="none"
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="populationOverride">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <NumberField
                          label="Population"
                          placeholder="Enter Population"
                          helperText="Leave blank to use population from Ethnologue"
                          margin="none"
                          validate={maxPopulation}
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="isDialect">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <CheckboxField
                          label="Is this language a dialect?"
                          margin="none"
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="isSignLanguage">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <CheckboxField
                          label="Is this language a sign language?"
                          margin="none"
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="hasExternalFirstScripture">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <CheckboxField
                          label="Was this language's first scripture produced outside of CORD?"
                          margin="none"
                          keepHelperTextSpacing
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <Grid item xs={12} sm={6}>
                    <SelectField
                      label="Sensitivity"
                      name="sensitivity"
                      options={SensitivityList}
                      defaultValue="High"
                    />
                  </Grid>
                  <SecuredField obj={language} name="signLanguageCode">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <SignLanguageCodeField
                          {...props}
                          label="Sign Language Code"
                          placeholder="Enter Sign Language Code"
                          disabled={!values.language?.isSignLanguage}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                  <SecuredField obj={language} name="sponsorEstimatedEndDate">
                    {(props) => (
                      <Grid item xs={12} sm={6}>
                        <YearField
                          {...props}
                          label="Estimated Sponsor End FY"
                          name="sponsorEstimatedEndFY"
                        />
                      </Grid>
                    )}
                  </SecuredField>
                </Grid>
              </Grid>
            )}
            {canReadAny(
              language?.ethnologue,
              true,
              'name',
              'code',
              'provisionalCode',
              'population'
            ) && (
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom>
                  Ethnologue
                </Typography>
                <FieldGroup prefix="ethnologue">
                  <Grid container spacing={2}>
                    <SecuredField obj={language?.ethnologue} name="name">
                      {(props) => (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Ethnologue Name"
                            placeholder="Enter Ethnologue Name"
                            validate={minLength()}
                            margin="none"
                            {...props}
                          />
                        </Grid>
                      )}
                    </SecuredField>
                    <SecuredField obj={language?.ethnologue} name="code">
                      {(props) => (
                        <Grid item xs={12} sm={6}>
                          <AlphaLowercaseField
                            chars={3}
                            label="Ethnologue Code"
                            placeholder="Enter Ethnologue Code"
                            margin="none"
                            {...props}
                          />
                        </Grid>
                      )}
                    </SecuredField>
                    <SecuredField
                      obj={language?.ethnologue}
                      name="provisionalCode"
                    >
                      {(props) => (
                        <Grid item xs={12} sm={6}>
                          <AlphaLowercaseField
                            chars={3}
                            label="Provisional Code"
                            placeholder="Enter Provisional Code"
                            margin="none"
                            {...props}
                          />
                        </Grid>
                      )}
                    </SecuredField>
                    <SecuredField obj={language?.ethnologue} name="population">
                      {(props) => (
                        <Grid item xs={12} sm={6}>
                          <NumberField
                            label="Ethnologue Population"
                            placeholder="Enter Ethnologue Population"
                            margin="none"
                            validate={maxPopulation}
                            {...props}
                          />
                        </Grid>
                      )}
                    </SecuredField>
                  </Grid>
                </FieldGroup>
              </Grid>
            )}
            {canReadAny(
              language,
              true,
              'leastOfThese',
              'leastOfTheseReason'
            ) && (
              <Grid item>
                <Typography variant="h4">Least of These</Typography>
                <SecuredField obj={language} name="leastOfThese">
                  {(props) => (
                    <CheckboxField
                      label="Is this a Least of These partnership?"
                      {...props}
                    />
                  )}
                </SecuredField>
                <SecuredField obj={language} name="leastOfTheseReason">
                  {(props) => (
                    <TextField
                      label="Reasoning"
                      multiline
                      placeholder="Enter Reasoning"
                      helperText="Why is this language a Least of These partnership?"
                      minRows={2}
                      {...props}
                    />
                  )}
                </SecuredField>
              </Grid>
            )}
          </Grid>
        );
      }}
    </DialogForm>
  );
};

// Two letters followed by two numbers
const SignLanguageCodeField = (props: FormattedTextFieldProps) => {
  return (
    <FormattedTextField
      accept={/[a-zA-Z\d]/g}
      formatInput={(value) =>
        (value.match(/[a-zA-Z\d]+/g) || []).join('').slice(0, 4)
      }
      replace={(value) => value.toUpperCase()}
      validate={(value) =>
        !value || /^[A-Z]{2}\d{2}$/.exec(value)
          ? undefined
          : `Must be two letters followed by two numbers`
      }
      {...props}
    />
  );
};
