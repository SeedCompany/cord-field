import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { addItemToList } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import {
  CreatePartnerWithOrganizationDocument,
  CreatePartnerWithOrganizationMutation,
} from './CreatePartner.graphql';
import { CreatePartnerForm, CreatePartnerFormProps } from './CreatePartnerForm';

type SubmitResult =
  CreatePartnerWithOrganizationMutation['createPartnerWithOrganization']['partner'];
type CreatePartnerProps = Except<
  CreatePartnerFormProps<SubmitResult>,
  'onSubmit'
>;

export const CreatePartner = (props: CreatePartnerProps) => {
  const [createPartnerWithOrganization] = useMutation(
    CreatePartnerWithOrganizationDocument,
    {
      update: addItemToList({
        listId: 'partners',
        outputToItem: (data) => data.createPartnerWithOrganization.partner,
      }),
    }
  );
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CreatePartnerForm<SubmitResult>
      onSuccess={(partner) =>
        enqueueSnackbar(
          `Created partner: ${partner.organization.value?.name.value}`,
          {
            variant: 'success',
            action: () => (
              <ButtonLink color="inherit" to={`/partners/${partner.id}`}>
                View
              </ButtonLink>
            ),
          }
        )
      }
      {...props}
      onSubmit={async ({ organization }) => {
        const { data } = await createPartnerWithOrganization({
          variables: { input: { organization, partner: {} } },
        });
        return data!.createPartnerWithOrganization.partner;
      }}
    />
  );
};
