import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_TranslationProject_Fragment as TranslationProjectIdFragment,
} from '~/common/fragments';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { CheckboxField, SubmitError } from '../../../../components/form';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { CreateInternshipEngagementDocument } from './CreateInternshipEngagement.graphql';

interface CreateInternshipEngagementFormValues {
  engagement: {
    internId?: UserLookupItem;
    isUnknown: boolean;
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
            internId: engagement.internId ? engagement.internId.id : undefined,
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
      {({
        values,
      }: {
        values: Partial<CreateInternshipEngagementFormValues>;
      }) => {
        return (
          <>
            <CheckboxField
              name="engagement.isUnknown"
              label="Intern is unknown"
              margin="none"
            />
            <UserField
              disabled={values.engagement?.isUnknown}
              name="engagement.internId"
              label="Intern"
              placeholder="Enter person's name (Leave blank for unknown)"
            />
            <SubmitError />
          </>
        );
      }}
    </DialogForm>
  );
};
