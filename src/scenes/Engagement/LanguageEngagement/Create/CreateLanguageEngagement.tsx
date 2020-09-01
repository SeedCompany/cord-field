import React from 'react';
import { Except } from 'type-fest';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import {
  LanguageField,
  LanguageLookupItem,
} from '../../../../components/form/Lookup';
import { ProjectOverviewDocument as ProjectOverview } from '../../../Projects/Overview/ProjectOverview.generated';
import { useCreateLanguageEngagementMutation } from './CreateLanguageEngagement.generated';

interface CreateLanguageEngagementFormValues {
  engagement: {
    languageId: LanguageLookupItem;
  };
}

type CreateLanguageEngagementProps = Except<
  DialogFormProps<CreateLanguageEngagementFormValues>,
  'onSubmit'
> & {
  projectId: string;
};

export const CreateLanguageEngagement = ({
  projectId,
  ...props
}: CreateLanguageEngagementProps) => {
  const [createEngagement] = useCreateLanguageEngagementMutation();
  const submit = async ({ engagement }: CreateLanguageEngagementFormValues) => {
    await createEngagement({
      variables: {
        input: {
          engagement: { projectId, languageId: engagement.languageId.id },
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
    <DialogForm {...props} onSubmit={submit} title="Create Language Engagement">
      <SubmitError />
      <LanguageField name="engagement.languageId" label="Language" required />
    </DialogForm>
  );
};
