import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { ProjectIdFragment } from '~/common/fragments';
import { callAll, Nullable } from '../../../../common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { invalidatePartnersEngagements } from '../../LanguageEngagement/Create/invalidatePartnersEngagements';
import { CreateInternshipEngagementDocument } from './CreateInternshipEngagement.graphql';

interface CreateInternshipEngagementFormValues {
  intern: UserLookupItem;
}

type CreateInternshipEngagementProps = Except<
  DialogFormProps<CreateInternshipEngagementFormValues>,
  'onSubmit'
> & {
  project: ProjectIdFragment;
};

// Strings are the free solo "Create" option
const lacksInternRole = (person: UserLookupItem | string) =>
  typeof person !== 'string' && !person.roles.value.includes('Intern');

const requireInternRole = (intern: Nullable<UserLookupItem>) =>
  intern && lacksInternRole(intern)
    ? 'This person must have the Intern role'
    : undefined;

export const CreateInternshipEngagement = ({
  project,
  ...props
}: CreateInternshipEngagementProps) => {
  const [createEngagement] = useMutation(CreateInternshipEngagementDocument);
  const submit = async ({ intern }: CreateInternshipEngagementFormValues) => {
    await createEngagement({
      variables: {
        input: {
          project: project.id,
          intern: intern.id,
          changeset: project.changeset?.id,
        },
      },
      update: callAll(
        addItemToList({
          listId: [project, 'engagements'],
          outputToItem: (res) => res.createInternshipEngagement.engagement,
        }),
        invalidatePartnersEngagements()
      ),
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
        name="intern"
        label="Intern"
        placeholder="Enter person's name"
        helperText="Only people with the Intern role can be selected"
        required
        multiple={false}
        getOptionDisabled={lacksInternRole}
        validate={requireInternRole}
        getInitialValues={(name) => ({
          realFirstName: name,
          displayFirstName: name,
          roles: ['Intern'],
        })}
      />
    </DialogForm>
  );
};
