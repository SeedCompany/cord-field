import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { addItemToList } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { CreateOrganizationDocument } from '../../Organizations/Create/CreateOrganization.graphql';
import {
  CreatePartnerDocument,
  CreatePartnerMutation,
} from './CreatePartner.graphql';
import { CreatePartnerForm, CreatePartnerFormProps } from './CreatePartnerForm';
import { isDraftOrganization } from './draftOrganization';

type SubmitResult = CreatePartnerMutation['createPartner']['partner'];
type CreatePartnerProps = Except<
  CreatePartnerFormProps<SubmitResult>,
  'onSubmit'
>;

export const CreatePartner = (props: CreatePartnerProps) => {
  const [createPartner] = useMutation(CreatePartnerDocument, {
    update: addItemToList({
      listId: 'partners',
      outputToItem: (data) => data.createPartner.partner,
    }),
  });
  const [createOrganization] = useMutation(CreateOrganizationDocument);
  const { enqueueSnackbar } = useSnackbar();

  async function createOrgFromDraft(name: string) {
    const { data } = await createOrganization({
      variables: { input: { name } },
    });
    return data!.createOrganization.organization.id;
  }

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
      onSubmit={async ({ orgLookup }) => {
        const organization = isDraftOrganization(orgLookup)
          ? await createOrgFromDraft(orgLookup.name.value ?? '')
          : orgLookup.id;
        const { data } = await createPartner({
          variables: {
            input: {
              organization,
            },
          },
        });
        return data!.createPartner.partner;
      }}
    />
  );
};
