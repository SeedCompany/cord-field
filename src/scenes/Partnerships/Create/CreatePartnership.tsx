import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreatePartnershipInput, GQLOperations } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { PartnershipForm, PartnershipFormProps } from '../PartnershipForm';
import { useCreatePartnershipMutation } from './CreatePartnership.generated';

export type CreatePartnershipProps = Except<
  PartnershipFormProps<CreatePartnershipInput>,
  'onSubmit'
>;
export const CreatePartnership = (props: CreatePartnershipProps) => {
  const [createLang] = useCreatePartnershipMutation();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <PartnershipForm<CreatePartnershipInput>
      title="Create Language"
      {...props}
      onSubmit={async (input) => {
        const res = await createLang({
          variables: { input },
          refetchQueries: [GQLOperations.Query.Languages],
        });

        const { partnership } = res.data!.createPartnership;

        enqueueSnackbar(
          `Created partnership with organization: ${partnership.organization.name.value}`,
          {
            variant: 'success',
            action: () => (
              <ButtonLink color="inherit" to={`/languages/${partnership.id}`}>
                View
              </ButtonLink>
            ),
          }
        );
      }}
    />
  );
};
