import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList } from '../../../api';
import { PartnerListItemFragmentDoc } from '../../../components/PartnerListItemCard/PartnerListItemCard.generated';
import { ButtonLink } from '../../../components/Routing';
import {
  CreatePartnerDocument,
  CreatePartnerMutation,
} from './CreatePartner.generated';
import { CreatePartnerForm, CreatePartnerFormProps } from './CreatePartnerForm';

type CreatePartnerProps = Except<
  CreatePartnerFormProps<CreatePartnerMutation['createPartner']['partner']>,
  'onSubmit'
>;

export const CreatePartner = (props: CreatePartnerProps) => {
  const [createPartner] = useMutation(CreatePartnerDocument, {
    update: addItemToList({
      listId: 'partners',
      itemFragment: PartnerListItemFragmentDoc,
      outputToItem: (data) => data.createPartner.partner,
    }),
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CreatePartnerForm
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
      onSubmit={async ({ orgLookup: { id: organizationId } }) => {
        const { data } = await createPartner({
          variables: {
            input: {
              partner: {
                organizationId,
              },
            },
          },
        });
        return data!.createPartner.partner;
      }}
    />
  );
};
