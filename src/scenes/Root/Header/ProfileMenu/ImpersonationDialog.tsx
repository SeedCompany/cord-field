import { MenuItem, MenuItemProps } from '@mui/material';
import { useContext } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { RoleLabels, RoleList } from '~/api/schema/enumLists';
import { Role } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { useDialog } from '../../../../components/Dialog';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { AutocompleteField } from '../../../../components/form';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { useSession } from '../../../../components/Session';

export const ImpersonationMenuItem = (props: MenuItemProps) => {
  const { session, impersonator } = useSession();
  const impersonation = useContext(ImpersonationContext);
  const loggedInUser = impersonator ?? session;

  const [impersonationDialogState, openImpersonationDialog] = useDialog();

  // Only show to admins for now
  if (!loggedInUser?.roles.value.includes('Administrator')) {
    return null;
  }

  return (
    <>
      <MenuItem
        {...props}
        onClick={(event) => {
          if (impersonation.enabled) {
            // Let the menu close before clearing impersonation
            setTimeout(() => impersonation.set({}), 100);
          } else {
            openImpersonationDialog();
          }

          props.onClick?.(event);
        }}
      >
        {impersonation.enabled ? 'Stop Impersonating' : 'Impersonate'}
      </MenuItem>
      <ImpersonationDialog {...impersonationDialogState} />
    </>
  );
};

interface ImpersonationFormValues {
  user?: UserLookupItem;
  roles?: readonly Role[];
}

export const ImpersonationDialog = (
  props: Omit<DialogFormProps<ImpersonationFormValues>, 'onSubmit'>
) => {
  const impersonation = useContext(ImpersonationContext);
  const { session, impersonator } = useSession();
  const loggedInUser = impersonator ?? session;

  return (
    <DialogForm
      {...props}
      onSubmit={(values) => {
        impersonation.set({
          user: values.user?.id,
          roles: values.roles,
        });
      }}
      title="Impersonation"
      submitLabel="Go"
    >
      <UserField
        name="user"
        variant="outlined"
        placeholder="Pick a person to impersonate"
        getOptionDisabled={(user) => loggedInUser?.id === user.id}
        createPower={undefined} // No new user here
      />
      <AutocompleteField
        name="roles"
        label="Roles"
        placeholder="Pick role(s) to impersonate"
        variant="outlined"
        multiple
        options={RoleList}
        getOptionLabel={labelFrom(RoleLabels)}
      />
    </DialogForm>
  );
};
