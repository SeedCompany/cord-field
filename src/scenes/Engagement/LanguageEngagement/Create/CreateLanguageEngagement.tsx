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
  language: LanguageLookupItem;
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
  const submit = async (input: CreateLanguageEngagementFormValues) => {
    const createLanguageEngagementInput = {
      engagement: { projectId, languageId: input.language.id },
    };
    await createEngagement({
      variables: { input: createLanguageEngagementInput },
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
      <LanguageField name="language" label="Language" required />
    </DialogForm>
  );
};
