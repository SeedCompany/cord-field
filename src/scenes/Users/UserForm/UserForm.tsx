import { Stack } from '@mui/material';
import { memoize } from 'lodash';
import { SetRequired } from 'type-fest';
import {
  GenderLabels,
  GenderList,
  RoleLabels,
  UserStatusLabels,
  UserStatusList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  EmailField,
  EnumField,
  matchFieldIfSame,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { AutocompleteField } from '../../../components/form/AutocompleteField';
import { useSession } from '../../../components/Session';
import { UserFormFragment } from './UserForm.graphql';

export type UserFormProps<T, R = void> = SetRequired<
  DialogFormProps<T, R>,
  'fieldsPrefix'
> & {
  /** The pre-existing user to edit */
  user?: UserFormFragment;
};

const decorators = memoize((prefix: string) => [
  ...DialogForm.defaultDecorators,
  matchFieldIfSame(`${prefix}.realFirstName`, `${prefix}.displayFirstName`),
  matchFieldIfSame(`${prefix}.realLastName`, `${prefix}.displayLastName`),
]);

export const UserForm = <T, R = void>({
  user,
  ...rest
}: UserFormProps<T, R>) => {
  const { session } = useSession();
  return (
    <DialogForm<T, R>
      DialogProps={{
        maxWidth: 'sm',
      }}
      {...rest}
      decorators={decorators(rest.fieldsPrefix)}
    >
      <SubmitError />
      <Stack>
        <Stack direction="row" spacing={2}>
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
        </Stack>
        <Stack direction="row" spacing={2}>
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
        </Stack>
        <SecuredField obj={user} name="gender">
          {(props) => (
            <EnumField
              label="Gender"
              options={GenderList}
              getLabel={labelFrom(GenderLabels)}
              {...props}
            />
          )}
        </SecuredField>
        <SecuredField obj={user} name="status">
          {(props) => (
            <EnumField
              label="Status"
              options={UserStatusList}
              getLabel={labelFrom(UserStatusLabels)}
              {...props}
            />
          )}
        </SecuredField>
        <SecuredField obj={user} name="email">
          {(props) => <EmailField {...props} required={false} />}
        </SecuredField>
        <SecuredField obj={user} name="title">
          {(props) => (
            <TextField label="Title" placeholder="Enter Title" {...props} />
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
        {/*TODO: Replace with timezone autocomplete #307 */}
        {/*<SecuredField obj={user} name="timezone">*/}
        {/*  {(props) => (*/}
        {/*    <TextField label="Timezone" placeholder="Enter Timezone" {...props} />*/}
        {/*  )}*/}
        {/*</SecuredField>*/}
        <SecuredField obj={user} name="about">
          {(props) => (
            <TextField
              label="About"
              multiline
              placeholder="Enter About"
              minRows={2}
              {...props}
            />
          )}
        </SecuredField>
        <SecuredField obj={user} name="roles">
          {(props) => (
            <AutocompleteField
              multiple
              options={
                user?.roles.assignableRoles ??
                session?.roles.assignableRoles ??
                []
              }
              getOptionLabel={labelFrom(RoleLabels)}
              label="Roles"
              variant="outlined"
              {...props}
            />
          )}
        </SecuredField>
      </Stack>
    </DialogForm>
  );
};
