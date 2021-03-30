import { useMutation } from '@apollo/client';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import React, { useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import {
  addItemToList,
  CreateProjectMember as CreateProjectMemberInput,
  displayRole,
  RoleList,
} from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { ProjectMemberCardFragmentDoc } from '../../../../components/ProjectMemberCard/ProjectMember.generated';
import { ProjectMembersQuery } from '../List/ProjectMembers.generated';
import { CreateProjectMemberDocument } from './CreateProjectMember.generated';

interface FormValues {
  projectMember: Partial<
    Merge<
      CreateProjectMemberInput,
      {
        userId: UserLookupItem;
      }
    >
  >;
}

type CreateProjectMemberProps = Except<
  DialogFormProps<FormValues>,
  'onSubmit' | 'initialValues'
> & {
  project: ProjectMembersQuery['project'];
};

const decorators: Array<Decorator<FormValues>> = [
  ...DialogForm.defaultDecorators,
  onFieldChange({
    field: 'projectMember.userId',
    isEqual: UserField.isEqual,
    updates: { 'projectMember.roles': () => [] },
  }),
];

export const CreateProjectMember = ({
  project,
  ...props
}: CreateProjectMemberProps) => {
  const [createProjectMember] = useMutation(CreateProjectMemberDocument, {
    update: addItemToList({
      listId: [project, 'team'],
      itemFragment: ProjectMemberCardFragmentDoc,
      outputToItem: (data) => data.createProjectMember.projectMember,
    }),
  });

  const initialValues = useMemo(
    () => ({
      projectMember: {
        projectId: project.id,
      },
    }),
    [project.id]
  );

  return (
    <DialogForm<FormValues>
      title="Add Team Member"
      {...props}
      initialValues={initialValues}
      decorators={decorators}
      onSubmit={async ({ projectMember }) => {
        const data = projectMember as Required<typeof projectMember>;
        const input = {
          projectMember: {
            ...data,
            userId: data.userId.id,
          },
        };

        await createProjectMember({ variables: { input } });
      }}
      fieldsPrefix="projectMember"
    >
      {({ values }) => {
        const user = values.projectMember.userId;
        const canRead = user?.roles.canRead;
        const userRoles = user?.roles.value;

        return (
          <>
            <SubmitError />
            <UserField name="userId" required variant="outlined" />
            <AutocompleteField
              disabled={!canRead || !userRoles}
              multiple
              options={RoleList}
              getOptionLabel={displayRole}
              name="roles"
              label="Roles"
              helperText={
                user
                  ? canRead
                    ? ''
                    : `You cannot read this person's roles`
                  : 'Select a person first'
              }
              getOptionDisabled={(option) =>
                !!userRoles && !userRoles.includes(option)
              }
              variant="outlined"
            />
          </>
        );
      }}
    </DialogForm>
  );
};
