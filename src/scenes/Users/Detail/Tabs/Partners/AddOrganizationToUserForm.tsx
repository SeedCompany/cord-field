import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { SubmitError } from '~/components/form';
import {
  PartnerField,
  PartnerLookupItem,
} from '~/components/form/Lookup/Partner';
import {
  AssignOrganizationToUserDocument,
  UserPartnersDocument,
} from './UserPartnerPanel/UserPartnerList.graphql';

interface FormValues {
  partner: PartnerLookupItem;
}

type AddOrganizationToUserFormProps = Except<
  DialogFormProps<FormValues>,
  'onSubmit' | 'initialValues'
> & {
  userId: string;
};

export const AddOrganizationToUserForm = ({
  userId,
  ...props
}: AddOrganizationToUserFormProps) => {
  const [assignOrganization] = useMutation(AssignOrganizationToUserDocument);

  return (
    <DialogForm<FormValues>
      title="Add Partner"
      {...props}
      onSubmit={async ({ partner }) => {
        await assignOrganization({
          variables: {
            user: userId,
            org: partner.organization.value!.id,
          },
          refetchQueries: [UserPartnersDocument],
        });
      }}
    >
      <SubmitError />
      <PartnerField name="partner" required />
    </DialogForm>
  );
};
