import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { canReadAny, SensitivityList } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  FieldGroup,
  FormattedTextField,
  FormattedTextFieldProps,
  matchFieldIfSame,
  NumberField,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { SelectField } from '../../../components/form/SelectField';
import { minLength, required } from '../../../components/form/validators';
import { YearField } from '../../../components/form/YearField';
import { LanguageFormFragment } from './LangugeForm.generated';

export type LanguageFormProps<T> = DialogFormProps<T> & {
  /** The pre-existing language to edit */
  language?: LanguageFormFragment;
};

const useStyles = makeStyles(() => ({
  content: {
    overflow: 'hidden', // prevent scroll bars from negative margins of Grid
  },
}));

const decorators = [
  ...DialogForm.defaultDecorators,
  matchFieldIfSame(`language.name`, `language.displayName`),
];

const sensitivitySelectOptions = SensitivityList.map((sensitivity) => ({
  value: sensitivity,
  label: sensitivity,
}));

export const LanguageForm = <T extends any>({
  language,
  ...rest
}: LanguageFormProps<T>) => {
  const classes = useStyles();

  return (
    <DialogForm<T>
      DialogProps={{
        maxWidth: 'lg',
      }}
      {...rest}
      decorators={decorators}
    >
      <FieldGroup prefix="language">
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
                          (value.match(/[\d]+/g) || []).join('').substr(0, 5)
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
                <Grid item xs={12} sm={6}>
                  <SelectField
                    label="Sensitivity"
                    name="sensitivity"
                    selectOptions={sensitivitySelectOptions}
                    defaultValue="High"
                  />
                </Grid>
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
                        <EthnologueCodeField
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
                        <EthnologueCodeField
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
                          {...props}
                        />
                      </Grid>
                    )}
                  </SecuredField>
                </Grid>
              </FieldGroup>
            </Grid>
          )}
          {canReadAny(language, true, 'leastOfThese', 'leastOfTheseReason') && (
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
                    inputProps={{ rowsMin: 2 }}
                    {...props}
                  />
                )}
              </SecuredField>
            </Grid>
          )}
        </Grid>
      </FieldGroup>
    </DialogForm>
  );
};

// A 3-character lower-cased alpha string
const EthnologueCodeField = (props: FormattedTextFieldProps) => {
  return (
    <FormattedTextField
      accept={/[a-zA-Z]/g}
      formatInput={(value) =>
        (value.match(/[a-zA-Z]+/g) || []).join('').substr(0, 3)
      }
      replace={(value) => value.toLowerCase()}
      validate={(value) =>
        !value || value.length === 3 ? undefined : `Must be 3 characters`
      }
      {...props}
    />
  );
};
