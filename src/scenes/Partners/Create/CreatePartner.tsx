import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { OrganizationLookupItem } from '../../../components/form/Lookup';
import { ButtonLink } from '../../../components/Routing';
import {
  CreatePartnerMutation,
  useCreatePartnerMutation,
} from './CreatePartner.generated';
import { CreatePartnerForm, CreatePartnerFormProps } from './CreatePartnerForm';

type CreatePartnerProps = Except<
  CreatePartnerFormProps<
    { orgLookup: OrganizationLookupItem },
    CreatePartnerMutation['createPartner']['partner']
  >,
  'onSubmit'
>;

export const CreatePartner = (props: CreatePartnerProps) => {
  const [createPartner] = useCreatePartnerMutation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <CreatePartnerForm
      onSuccess={(partner) =>
        enqueueSnackbar(
          `Created partner ${partner.organization.value?.name.value}`,
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
          //TODO: add in after partner list is ready
          //   refetchQueries: [GQLOperations.Query.Partners],
        });
        return data!.createPartner.partner;
      }}
    />
  );
};
