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
  intern: UserLookupItem;
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
  const submit = async (input: CreateInternshipEngagementFormValues) => {
    const createInternshipEngagementInput = {
      engagement: { projectId, internId: input.intern.id },
    };
    await createEngagement({
      variables: { input: createInternshipEngagementInput },
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
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={submit}
      title="Create Internship Engagement"
    >
      <SubmitError />
      <UserField
        name="intern"
        label="Intern"
        placeholder="Enter person's name"
        required
      />
    </DialogForm>
  );
};
