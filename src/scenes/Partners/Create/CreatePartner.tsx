import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { addItemToList } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import {
  CreatePartnerDocument,
  CreatePartnerMutation,
} from './CreatePartner.graphql';
import { CreatePartnerForm, CreatePartnerFormProps } from './CreatePartnerForm';

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
      onSubmit={async ({ orgLookup: { id: organization } }) => {
        const { data } = await createPartner({
          variables: {
            input: {
              partner: {
                organization,
              },
            },
          },
        });
        return data!.createPartner.partner;
      }}
    />
  );
};
