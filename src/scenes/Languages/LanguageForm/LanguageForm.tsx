import { Grid } from '@material-ui/core';
import { Decorator } from 'final-form';
import { memoize } from 'lodash';
import React from 'react';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  FieldGroup,
  matchFieldIfSame,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { LanguageFormFragment } from './LangugeForm.generated';

export type LanguageFormProps<T> = DialogFormProps<T> & {
  /** The pre-existing language to edit */
  language?: LanguageFormFragment;
  prefix: string;
};

const decorators = memoize((prefix: string) => [
  matchFieldIfSame(`${prefix}.realFirstName`, `${prefix}.displayFirstName`),
  matchFieldIfSame(`${prefix}.realLastName`, `${prefix}.displayLastName`),
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
    decorators={decorators(prefix) as Array<Decorator<T>>}
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
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <SecuredField obj={language} name="displayNamePronunciation">
            {(props) => (
              <TextField
                label="Pronounciation"
                placeholder="Enter Pronounciation"
                required
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
        <Grid item xs>
          <SecuredField obj={language} name="registryOfDialectsCode">
            {(props) => (
              <TextField
                label="Registry Of Dialects Code"
                placeholder="Registry Of Dialects Code"
                required
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
      </Grid>
      {/* <SecuredField obj={language} name="populationOverride">
        {(props) => (
          <EmailField
            required={false}
            {...props}
            // Email can't be changed right now but still show it
            initialValue={user?.email.value ?? ''}
            disabled={!!user}
          />
        )}
      </SecuredField>
      <SecuredField obj={language} name="phone">
        {(props) => (
          <TextField
            label="Phone"
            placeholder="Enter Phone Number"
            type="tel"
            {...props}
          />
        )}
      </SecuredField>
      <SecuredField obj={language} name="timezone">
        {(props) => (
          <TextField label="Timezone" placeholder="Enter Timezone" {...props} />
        )}
      </SecuredField>
      <SecuredField obj={language} name="bio">
        {(props) => (
          <TextField
            label="Biography"
            multiline
            placeholder="Enter Biography"
            inputProps={{ rowsMin: 2 }}
            {...props}
          />
        )}
      </SecuredField> */}
    </FieldGroup>
  </DialogForm>
);
