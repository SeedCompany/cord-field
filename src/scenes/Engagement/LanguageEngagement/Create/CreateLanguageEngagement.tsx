import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { callAll } from '~/common';
import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_TranslationProject_Fragment as TranslationProjectIdFragment,
} from '~/common/fragments';
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
import { recalculateSensitivity } from './recalculateSensitivity';

interface CreateLanguageEngagementFormValues {
  engagement: {
    languageId?: LanguageLookupItem;
  };
}

type ProjectIdFragment =
  | TranslationProjectIdFragment
  | InternshipProjectIdFragment;

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
  const submit = async ({ engagement }: CreateLanguageEngagementFormValues) => {
    const languageRef = engagement.languageId
      ? ({
          __typename: 'Language',
          id: engagement.languageId.id,
        } as const)
      : ({ __typename: 'Language' } as const);

    await createEngagement({
      variables: {
        input: {
          engagement: {
            projectId: project.id,
            languageId: engagement.languageId
              ? engagement.languageId.id
              : undefined,
          },
          changeset: project.changeset?.id,
        },
      },
      update: languageRef.id
        ? callAll(
            addItemToList({
              listId: [project, 'engagements'],
              outputToItem: (res) => res.createLanguageEngagement.engagement,
            }),
            addItemToList({
              listId: [languageRef, 'projects'],
              outputToItem: () => project,
            }),
            recalculateSensitivity(project)
          )
        : callAll(
            addItemToList({
              listId: [project, 'engagements'],
              outputToItem: (res) => res.createLanguageEngagement.engagement,
            }),
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
      <LanguageField
        name="engagement.languageId"
        label="Language (Leave blank if unknown)"
      />
    </DialogForm>
  );
};
