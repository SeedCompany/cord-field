import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { callAll } from '~/common';
import { ProjectIdFragment } from '~/common/fragments';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import {
  LanguageField,
  LanguageLookupItem,
} from '../../../../components/form/Lookup';
import { CreateLanguageEngagementDocument } from './CreateLanguageEngagement.graphql';
import { invalidatePartnersEngagements } from './invalidatePartnersEngagements';
import { recalculateSensitivity } from './recalculateSensitivity';

interface CreateLanguageEngagementFormValues {
  language: LanguageLookupItem;
}

type CreateLanguageEngagementProps = Except<
  DialogFormProps<CreateLanguageEngagementFormValues>,
  'onSubmit'
> & {
  project: ProjectIdFragment;
};

export const CreateLanguageEngagement = ({
  project,
  ...props
}: CreateLanguageEngagementProps) => {
  const [createEngagement] = useMutation(CreateLanguageEngagementDocument);
  const submit = async ({ language }: CreateLanguageEngagementFormValues) => {
    const languageRef = {
      __typename: 'Language',
      id: language.id,
    } as const;
    await createEngagement({
      variables: {
        input: {
          project: project.id,
          language: language.id,
          changeset: project.changeset?.id,
        },
      },
      update: callAll(
        addItemToList({
          listId: [project, 'engagements'],
          outputToItem: (res) => res.createLanguageEngagement.engagement,
        }),
        addItemToList({
          listId: [languageRef, 'projects'],
          outputToItem: () => project,
        }),
        invalidatePartnersEngagements(),
        recalculateSensitivity(project)
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
      <LanguageField name="language" label="Language" required />
    </DialogForm>
  );
};
