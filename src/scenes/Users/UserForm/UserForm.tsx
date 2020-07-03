import { Grid } from '@material-ui/core';
import { Decorator } from 'final-form';
import { memoize } from 'lodash';
import React from 'react';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  EmailField,
  FieldGroup,
  matchFieldIfSame,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { UserFormFragment } from './UserForm.generated';

export type UserFormProps<T> = DialogFormProps<T> & {
  /** The pre-existing user to edit */
  user?: UserFormFragment;
  prefix: string;
};

const decorators = memoize((prefix: string) => [
  matchFieldIfSame(`${prefix}.realFirstName`, `${prefix}.displayFirstName`),
  matchFieldIfSame(`${prefix}.realLastName`, `${prefix}.displayLastName`),
]);

export const UserForm = <T extends any>({
  user,
  prefix,
  ...rest
}: UserFormProps<T>) => (
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
          <SecuredField obj={user} name="realFirstName">
            {(props) => (
              <TextField
                label="First Name"
                placeholder="Enter First Name"
                required
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
        <Grid item xs>
          <SecuredField obj={user} name="realLastName">
            {(props) => (
              <TextField
                label="Last Name"
                placeholder="Enter Last Name"
                required
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <SecuredField obj={user} name="displayFirstName">
            {(props) => (
              <TextField
                label="Public First Name"
                placeholder="Enter Public First Name"
                required
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
        <Grid item xs>
          <SecuredField obj={user} name="displayLastName">
            {(props) => (
              <TextField
                label="Public Last Name"
                placeholder="Enter Public Last Name"
                required
                {...props}
              />
            )}
          </SecuredField>
        </Grid>
      </Grid>
      <SecuredField obj={user} name="email">
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
      <SecuredField obj={user} name="phone">
        {(props) => (
          <TextField
            label="Phone"
            placeholder="Enter Phone Number"
            type="tel"
            {...props}
          />
        )}
      </SecuredField>
      <SecuredField obj={user} name="timezone">
        {(props) => (
          <TextField label="Timezone" placeholder="Enter Timezone" {...props} />
        )}
      </SecuredField>
      <SecuredField obj={user} name="bio">
        {(props) => (
          <TextField
            label="Biography"
            multiline
            placeholder="Enter Biography"
            inputProps={{ rowsMin: 2 }}
            {...props}
          />
        )}
      </SecuredField>
    </FieldGroup>
  </DialogForm>
);
