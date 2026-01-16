import { useMutation } from '@apollo/client';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { Except, Merge } from 'type-fest';
import { addItemToList } from '~/api';
import {
  CreateProjectMember as CreateProjectMemberInput,
  RoleLabels,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { ProjectMembersQuery } from '../List/ProjectMembers.graphql';
import { CreateProjectMemberDocument } from './CreateProjectMember.graphql';

type FormValues = Merge<
  Omit<CreateProjectMemberInput, 'project'>,
  {
    user: UserLookupItem;
  }
>;

type CreateProjectMemberProps = Except<
  DialogFormProps<FormValues>,
  'onSubmit' | 'initialValues'
> & {
  project: ProjectMembersQuery['project'];
};

const decorators: Array<Decorator<FormValues>> = [
  ...DialogForm.defaultDecorators,
  onFieldChange({
    field: 'user',
    isEqual: UserField.isEqual,
    updates: { roles: () => [] },
  }),
];

export const CreateProjectMember = ({
  project,
  ...props
}: CreateProjectMemberProps) => {
  const [createProjectMember] = useMutation(CreateProjectMemberDocument, {
    update: addItemToList({
      listId: [project, 'team'],
      outputToItem: (data) => data.createProjectMember.projectMember,
    }),
  });

  return (
    <DialogForm<FormValues>
      title="Add Team Member"
      {...props}
      decorators={decorators}
      onSubmit={async (data) => {
        const input: CreateProjectMemberInput = {
          project: project.id,
          ...data,
          user: data.user.id,
        };

        await createProjectMember({ variables: { input } });
      }}
    >
      {({ values }) => {
        const user = values.user as Partial<FormValues>['user'];
        const canRead = user?.roles.canRead;
        const userRoles = user?.roles.value;

        return (
          <>
            <SubmitError />
            <UserField name="user" required variant="outlined" />
            <AutocompleteField
              disabled={!canRead || !userRoles}
              multiple
              options={userRoles || []}
              noOptionsText="No roles assignable to this person"
              getOptionLabel={labelFrom(RoleLabels)}
              name="roles"
              label="Roles"
              helperText={
                user
                  ? canRead
                    ? ''
                    : `You cannot read this person's roles`
                  : 'Select a person first'
              }
              variant="outlined"
            />
          </>
        );
      }}
    </DialogForm>
  );
};
