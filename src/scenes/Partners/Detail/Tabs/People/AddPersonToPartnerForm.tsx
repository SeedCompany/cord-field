import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { SubmitError } from '~/components/form';
import { UserField, UserLookupItem } from '~/components/form/Lookup/User';
import { UserDataGridRowFragment } from '~/components/UserDataGrid/userDataGridRow.graphql';
import {
  AssignPersonToPartnerDocument,
  PartnerDetailPeopleFragment,
} from './PartnerDetailsPeople.graphql';

interface FormValues {
  user: UserLookupItem;
}

type AddPersonToPartnerFormProps = Except<
  DialogFormProps<FormValues>,
  'onSubmit' | 'initialValues'
> & {
  partner: PartnerDetailPeopleFragment;
  onAdded: (user: UserDataGridRowFragment) => void;
};

export const AddPersonToPartnerForm = ({
  partner,
  onAdded,
  ...props
}: AddPersonToPartnerFormProps) => {
  const [assignOrganization] = useMutation(AssignPersonToPartnerDocument);

  return (
    <DialogForm<FormValues>
      title="Add Person to Partner"
      {...props}
      onSubmit={async ({ user }) => {
        const res = await assignOrganization({
          variables: {
            user: user.id,
            org: partner.organization.value!.id,
          },
          update: addItemToList({
            listId: [partner, 'people'],
            outputToItem: (data) => data.assignOrganizationToUser.user,
          }),
        });
        if (res.data) {
          onAdded(res.data.assignOrganizationToUser.user);
        }
      }}
    >
      <SubmitError />
      <UserField name="user" required />
    </DialogForm>
  );
};
