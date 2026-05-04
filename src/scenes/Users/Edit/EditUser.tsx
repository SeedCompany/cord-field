import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { onUpdateInvalidateProps } from '~/api';
import { UpdateUser as UpdateUserInput } from '~/api/schema.graphql';
import type { OrganizationLookupItemFragment } from '../../../components/form/Lookup/Organization/OrganizationLookup.graphql';
import { UserForm, UserFormProps } from '../UserForm';
import {
  EditUserOrganizationDocument,
  UpdateUserDocument,
} from './EditUser.graphql';

type EditUserFormValues = UpdateUserInput & {
  organization?: OrganizationLookupItemFragment | null;
};

export type EditUserProps = Except<
  UserFormProps<EditUserFormValues>,
  'onSubmit' | 'initialValues'
>;

export const EditUser = (props: EditUserProps) => {
  const [updateUser] = useMutation(UpdateUserDocument);
  const [editOrganization] = useMutation(EditUserOrganizationDocument);
  const user = props.user;

  const initialValues = useMemo(
    () =>
      user
        ? {
            id: user.id,
            realFirstName: user.realFirstName.value,
            realLastName: user.realLastName.value,
            displayFirstName: user.displayFirstName.value,
            displayLastName: user.displayLastName.value,
            phone: user.phone.value,
            timezone: user.timezone.value?.name,
            about: user.about.value,
            email: user.email.value,
            title: user.title.value,
            roles: user.roles.value,
            status: user.status.value,
            gender: user.gender.value,
            organization: user.organizations.items[0] ?? null,
          }
        : undefined,
    [user]
  );

  return (
    <UserForm<EditUserFormValues>
      title="Edit Person"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({ organization: newOrg, ...userInput }) => {
        await updateUser({
          variables: { input: userInput },
        });

        const oldOrg = user?.organizations.items[0] ?? null;
        const orgChanged = newOrg?.id !== oldOrg?.id;
        if (!user || !orgChanged) return;

        const doRemove = !!oldOrg;
        const doAssign = !!newOrg;
        await editOrganization({
          variables: {
            userId: user.id,
            // These are required GraphQL variables even when skipped by @include.
            newOrgId: newOrg?.id ?? user.id,
            oldOrgId: oldOrg?.id ?? user.id,
            doAssign,
            doRemove,
          },
          update: onUpdateInvalidateProps(user, 'organizations'),
        });
      }}
    />
  );
};
