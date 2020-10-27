import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { updateListQueryItems } from '../../../util';
import {
  CreatePartnerDocument,
  CreatePartnerMutation,
  NewPartnerFragmentDoc,
} from './CreatePartner.generated';
import { CreatePartnerForm, CreatePartnerFormProps } from './CreatePartnerForm';

type CreatePartnerProps = Except<
  CreatePartnerFormProps<CreatePartnerMutation['createPartner']['partner']>,
  'onSubmit'
>;

export const CreatePartner = (props: CreatePartnerProps) => {
  const [createPartner] = useMutation(CreatePartnerDocument);
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
          update(cache, { data }) {
            cache.modify({
              fields: {
                partners(existingItemRefs, { readField }) {
                  updateListQueryItems({
                    cache,
                    existingItemRefs,
                    fragment: NewPartnerFragmentDoc,
                    fragmentName: GQLOperations.Fragment.NewPartner,
                    newItem: data?.createPartner.partner,
                    readField,
                  });
                },
              },
            });
          },
        });
        return data!.createPartner.partner;
      }}
    />
  );
};
