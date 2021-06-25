import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList, useCurrentChangeset } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import {
  LanguageField,
  LanguageLookupItem,
} from '../../../../components/form/Lookup';
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
  const [changeset] = useCurrentChangeset();
  const [createEngagement] = useMutation(CreateLanguageEngagementDocument);
  const submit = async ({ engagement }: CreateLanguageEngagementFormValues) => {
    const projectRef = {
      __typename: 'TranslationProject',
      id: projectId,
      changeset: { id: changeset },
    } as const;
    const languageRef = {
      __typename: 'Language',
      id: engagement.languageId.id,
    } as const;
    await createEngagement({
      variables: {
        input: {
          engagement: { projectId, languageId: engagement.languageId.id },
          changeset,
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
    <DialogForm
      {...props}
      onSubmit={submit}
      title="Create Language Engagement"
      changesetAware
    >
      <SubmitError />
      <LanguageField name="engagement.languageId" label="Language" required />
    </DialogForm>
  );
};
