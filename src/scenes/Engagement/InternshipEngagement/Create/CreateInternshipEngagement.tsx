import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import {
  addItemToList,
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_TranslationProject_Fragment as TranslationProjectIdFragment,
} from '../../../../api';
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

type ProjectIdFragment =
  | TranslationProjectIdFragment
  | InternshipProjectIdFragment;

type CreateInternshipEngagementProps = Except<
  DialogFormProps<CreateInternshipEngagementFormValues>,
  'onSubmit'
> & {
  project: ProjectIdFragment;
};

export const CreateInternshipEngagement = ({
  project,
  ...props
}: CreateInternshipEngagementProps) => {
  const [createEngagement] = useMutation(CreateInternshipEngagementDocument);
  const submit = async ({
    engagement,
  }: CreateInternshipEngagementFormValues) => {
    await createEngagement({
      variables: {
        input: {
          engagement: {
            projectId: project.id,
            internId: engagement.internId.id,
          },
          changeset: project.changeset?.id,
        },
      },
      update: addItemToList({
        listId: [project, 'engagements'],
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
