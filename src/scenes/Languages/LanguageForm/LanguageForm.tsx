import { Grid, Typography } from '@material-ui/core';
import { memoize } from 'lodash';
import React from 'react';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  FieldGroup,
  matchFieldIfSame,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { NumberField } from '../../../components/form/NumberField';
import {
  charString,
  minLength,
  numberString,
} from '../../../components/form/validators';
import { LanguageFormFragment } from './LangugeForm.generated';

export type LanguageFormProps<T> = DialogFormProps<T> & {
  /** The pre-existing language to edit */
  language?: LanguageFormFragment;
  prefix: string;
};

const decorators = memoize((prefix: string) => [
  matchFieldIfSame(`${prefix}.name`, `${prefix}.displayName`),
]);

export const LanguageForm = <T extends any>({
  language,
  prefix,
  ...rest
}: LanguageFormProps<T>) => (
  <DialogForm<T>
    DialogProps={{
      fullWidth: true,
      maxWidth: 'sm',
    }}
    onlyDirtySubmit
    {...rest}
    decorators={decorators(prefix)}
  >
    <SubmitError />
    <FieldGroup prefix={prefix}>
      <Grid container spacing={2}>
        <Grid item xs>
          <SecuredField obj={language} name="name">
            {(props) => (
              <TextField
                label="Language Name"
                placeholder="Enter Language Name"
                required
                validate={minLength(2)}
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
        <Grid item xs>
          <SecuredField obj={language} name="displayName">
            {(props) => (
              <TextField
                label="Public Name"
                placeholder="Enter Public Name"
                required
                validate={minLength(2)}
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
      </Grid>
      <SecuredField obj={language} name="registryOfDialectsCode">
        {(props) => (
          <TextField
            label="Registry Of Dialects Code"
            placeholder="Registry Of Dialects Code"
            validate={[minLength(5), numberString]}
            {...props}
          />
        )}
      </SecuredField>
      <SecuredField obj={language} name="displayNamePronunciation">
        {(props) => (
          <TextField
            label="Pronounciation"
            placeholder="Enter Pronounciation"
            validate={minLength(2)}
            {...props}
          />
        )}
      </SecuredField>
      <Typography>Ethnologue</Typography>
      <FieldGroup prefix="ethnologue">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <SecuredField obj={language?.ethnologue} name="name">
              {(props) => (
                <TextField
                  label="Ethnologue Name"
                  placeholder="Ethnologue Name"
                  validate={minLength(2)}
                  {...props}
                />
              )}
            </SecuredField>
          </Grid>
          <Grid item xs={6}>
            <SecuredField obj={language?.ethnologue} name="id">
              {(props) => (
                <TextField
                  label="Ethnologue ID"
                  placeholder="Ethnologue ID"
                  validate={minLength(2)}
                  {...props}
                />
              )}
            </SecuredField>
          </Grid>
          <Grid item xs={6}>
            <SecuredField obj={language?.ethnologue} name="code">
              {(props) => (
                <TextField
                  label="Ethnologue Code"
                  placeholder="Ethnologue Code"
                  validate={[minLength(3), charString]}
                  {...props}
                />
              )}
            </SecuredField>
          </Grid>
          <Grid item xs={6}>
            <SecuredField obj={language?.ethnologue} name="provisionalCode">
              {(props) => (
                <TextField
                  label="Provisional Code"
                  placeholder="Provisional Code"
                  validate={minLength(3)}
                  {...props}
                />
              )}
            </SecuredField>
          </Grid>
          <Grid item xs={6}>
            <SecuredField obj={language?.ethnologue} name="population">
              {(props) => (
                <NumberField
                  label="Ethnologue Population"
                  placeholder="Ethnologue Population"
                  {...props}
                />
              )}
            </SecuredField>
          </Grid>
        </Grid>
      </FieldGroup>
      <SecuredField obj={language} name="populationOverride">
        {(props) => (
          <NumberField
            label="Custom Population"
            placeholder="Enter Custom Population (if different from Ethnologue population)"
            {...props}
          />
        )}
      </SecuredField>
      <SecuredField obj={language} name="leastOfThese">
        {(props) => <CheckboxField label="Least of Population" {...props} />}
      </SecuredField>
      <SecuredField obj={language} name="leastOfTheseReason">
        {(props) => (
          <TextField
            label="Least of These Reason"
            multiline
            placeholder="Enter Least of These Reason"
            inputProps={{ rowsMin: 2 }}
            validate={minLength(2)}
            {...props}
          />
        )}
      </SecuredField>
    </FieldGroup>
  </DialogForm>
);
