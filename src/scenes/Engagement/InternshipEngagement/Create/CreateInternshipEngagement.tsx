import React from 'react';
import { Except } from 'type-fest';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { ProjectOverviewDocument as ProjectOverview } from '../../../Projects/Overview/ProjectOverview.generated';
import { useCreateInternshipEngagementMutation } from './CreateInternshipEngagement.generated';

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
  const [createEngagement] = useCreateInternshipEngagementMutation();
  const submit = async ({
    engagement,
  }: CreateInternshipEngagementFormValues) => {
    await createEngagement({
      variables: {
        input: {
          engagement: { projectId, internId: engagement.internId.id },
        },
      },
      refetchQueries: [
        {
          query: ProjectOverview,
          variables: { input: projectId },
        },
      ],
      awaitRefetchQueries: true,
    });
  };
  return (
    <DialogForm
      {...props}
      onSubmit={submit}
      title="Create Internship Engagement"
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
