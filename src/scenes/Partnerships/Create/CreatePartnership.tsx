import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import {
  addItemToList,
  CreatePartnership as CreatePartnershipType,
} from '../../../api';
import { PartnerLookupItem } from '../../../components/form/Lookup';
import { callAll } from '../../../util';
import { updateOldPrimaryPartnership } from '../Edit';
import { invalidateBudgetRecords } from '../InvalidateBudget';
import { ProjectPartnershipsQuery } from '../List/PartnershipList.graphql';
import { PartnershipForm, PartnershipFormProps } from '../PartnershipForm';
import {
  CreatePartnershipDocument,
  CreatePartnershipMutation,
} from './CreatePartnership.graphql';

export interface CreatePartnershipFormInput {
  partnership: Pick<
    CreatePartnershipType,
    'projectId' | 'types' | 'financialReportingType' | 'primary'
  > & {
    partnerLookupItem: PartnerLookupItem;
  };
}

export type CreatePartnershipProps = Except<
  PartnershipFormProps<CreatePartnershipFormInput>,
  'onSubmit'
> & {
  project: ProjectPartnershipsQuery['project'];
};

const createdPartnership = (res: CreatePartnershipMutation) =>
  res.createPartnership.partnership;

export const CreatePartnership = ({
  project,
  ...props
}: CreatePartnershipProps) => {
  const [createPartnership] = useMutation(CreatePartnershipDocument, {
    update: callAll(
      addItemToList({
        listId: [project, 'partnerships'],
        outputToItem: createdPartnership,
      }),
      invalidateBudgetRecords(project, undefined, createdPartnership),
      updateOldPrimaryPartnership(project, createdPartnership)
    ),
  });

  return (
    <PartnershipForm<CreatePartnershipFormInput>
      title="Create Partnership"
      {...props}
      onSubmit={async ({ partnership: { partnerLookupItem, ...rest } }) => {
        await createPartnership({
          variables: {
            input: {
              partnership: {
                ...rest,
                projectId: project.id,
                partnerId: partnerLookupItem.id,
                primary: rest.primary || undefined,
              },
              changeset: project.changeset?.id,
            },
          },
        });
      }}
      changesetAware
    />
  );
};
