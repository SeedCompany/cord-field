import React from 'react';
import { Except } from 'type-fest';
import {
  CreatePartnership as CreatePartnershipType,
  GQLOperations,
} from '../../../api';
import { OrganizationLookupItem } from '../../../components/form/Lookup';
import { PartnershipForm, PartnershipFormProps } from '../PartnershipForm';
import { useCreatePartnershipMutation } from './CreatePartnership.generated';

export interface CreatePartnershipFormInput {
  partnership: Pick<
    CreatePartnershipType,
    'projectId' | 'types' | 'financialReportingType'
  > & {
    organizationId: OrganizationLookupItem;
  };
}

export type CreatePartnershipProps = Except<
  PartnershipFormProps<CreatePartnershipFormInput>,
  'onSubmit'
> & {
  projectId: CreatePartnershipType['projectId'];
};
export const CreatePartnership = ({
  projectId,
  ...props
}: CreatePartnershipProps) => {
  const [createPartnership] = useCreatePartnershipMutation();

  return (
    <PartnershipForm<CreatePartnershipFormInput>
      title="Create Partnership"
      {...props}
      onSubmit={async ({ partnership }) => {
        const input = {
          partnership: {
            ...partnership,
            projectId,
            organizationId: partnership.organizationId.id,
          },
        };
        await createPartnership({
          variables: { input },
          refetchQueries: [GQLOperations.Query.ProjectPartnerships],
        });
      }}
    />
  );
};
