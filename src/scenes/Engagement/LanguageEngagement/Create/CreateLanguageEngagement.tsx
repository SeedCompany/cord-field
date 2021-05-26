import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import {
  LanguageField,
  LanguageLookupItem,
} from '../../../../components/form/Lookup';
import { useCurrentPlanChange } from '../../../../components/PlanChangeCard';
import { callAll } from '../../../../util';
import { CreateLanguageEngagementDocument } from './CreateLanguageEngagement.generated';
import { recalculateSensitivity } from './recalculateSensitivity';

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
  const [changeId] = useCurrentPlanChange();
  const [createEngagement] = useMutation(CreateLanguageEngagementDocument);
  const submit = async ({ engagement }: CreateLanguageEngagementFormValues) => {
    const projectRef = {
      __typename: 'TranslationProject',
      id: projectId,
    } as const;
    const languageRef = {
      __typename: 'Language',
      id: engagement.languageId.id,
    } as const;
    await createEngagement({
      variables: {
        input: {
          engagement: { projectId, languageId: engagement.languageId.id },
          changeId,
        },
      },
      update: callAll(
        addItemToList({
          listId: [projectRef, 'engagements'],
          outputToItem: (res) => res.createLanguageEngagement.engagement,
        }),
        addItemToList({
          listId: [languageRef, 'projects'],
          outputToItem: () => projectRef,
        }),
        recalculateSensitivity(projectRef)
      ),
    });
  };
  return (
    <DialogForm {...props} onSubmit={submit} title="Create Language Engagement">
      <SubmitError />
      <LanguageField name="engagement.languageId" label="Language" required />
    </DialogForm>
  );
};
