import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { CheckboxField, SubmitError } from '~/components/form';
import { OrganizationField } from '~/components/form/Lookup';
import { OrganizationLookupItemFragment } from '~/components/form/Lookup/Organization/OrganizationLookup.graphql';
import {
  AssignOrganizationToUserDocument,
  AssignOrganizationToUserFormFragment,
} from './AssignOrgToUser.graphql';

interface AssignOrgToUserFormValues {
  assignment: {
    orgId: OrganizationLookupItemFragment | null;
    primary?: boolean;
  };
}

type AssignOrgToUserFormProps = Except<
  DialogFormProps<AssignOrgToUserFormValues>,
  'onSubmit' | 'initialValues'
> & {
  user: AssignOrganizationToUserFormFragment;
};

export const AssignOrgToUserForm = ({
  user,
  ...props
}: AssignOrgToUserFormProps) => {
  const [assignOrgToUser] = useMutation(AssignOrganizationToUserDocument, {
    update: addItemToList({
      listId: [user, 'partners'],
      outputToItem: (data) => data.assignOrganizationToUser.partner,
    }),
  });

  return (
    <DialogForm<AssignOrgToUserFormValues>
      title="Assign Organization to User"
      {...props}
      onSubmit={async ({ assignment }) => {
        const input = {
          assignment: {
            userId: user.id,
            orgId: assignment.orgId!.id,
            primary: assignment.primary ?? false,
          },
        };

        await assignOrgToUser({ variables: { input } });
      }}
      fieldsPrefix="assignment"
    >
      <SubmitError />
      <OrganizationField name="orgId" required variant="outlined" />
      <CheckboxField name="primary" label="Primary" />
    </DialogForm>
  );
};
