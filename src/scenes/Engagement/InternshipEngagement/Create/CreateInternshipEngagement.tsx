import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList, useCurrentChangeset } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { CreateInternshipEngagementDocument } from './CreateInternshipEngagement.generated';

interface CreateInternshipEngagementFormValues {
  engagement: {
    internId: UserLookupItem;
  };
}

type CreateInternshipEngagementProps = Except<
  DialogFormProps<CreateInternshipEngagementFormValues>,
  'onSubmit'
> & {
  projectId: string;
};

export const CreateInternshipEngagement = ({
  projectId,
  ...props
}: CreateInternshipEngagementProps) => {
  const [changeset] = useCurrentChangeset();
  const [createEngagement] = useMutation(CreateInternshipEngagementDocument);
  const submit = async ({
    engagement,
  }: CreateInternshipEngagementFormValues) => {
    await createEngagement({
      variables: {
        input: {
          engagement: { projectId, internId: engagement.internId.id },
          changeset,
        },
      },
      update: addItemToList({
        listId: [
          {
            __typename: 'InternshipProject',
            id: projectId,
            changeset: { id: changeset },
          },
          'engagements',
        ],
        outputToItem: (res) => res.createInternshipEngagement.engagement,
      }),
    });
  };
  return (
    <DialogForm
      {...props}
      onSubmit={submit}
      title="Create Intern Engagement"
      changesetAware
    >
      <SubmitError />
      <UserField
        name="engagement.internId"
        label="Intern"
        placeholder="Enter person's name"
        required
      />
    </DialogForm>
  );
};
