import React from 'react';
import { FormSpy } from 'react-final-form';
import { Except } from 'type-fest';
import { displayRole, Role, RoleList } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { FieldGroup, SubmitError } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { Nullable } from '../../../../util';
import { ProjectMembersDocument } from '../List/ProjectMembers.generated';
import { useCreateProjectMemberMutation } from './CreateProjectMember.generated';

interface DialogValues {
  projectMember: {
    userId: Nullable<UserLookupItem>;
    projectId: string;
    roles?: Role[];
  };
}

type CreateProjectMemberProps = Except<
  DialogFormProps<DialogValues>,
  'onSubmit' | 'initialValues'
> & {
  projectId: string;
};

export const CreateProjectMember = ({
  projectId,
  ...props
}: CreateProjectMemberProps) => {
  const [createProjectMember] = useCreateProjectMemberMutation({
    refetchQueries: [
      {
        query: ProjectMembersDocument,
        variables: { input: projectId },
      },
    ],
  });

  return (
    <DialogForm<DialogValues>
      title="Create Team Member"
      {...props}
      initialValues={{
        projectMember: {
          roles: [],
          projectId,
          userId: null,
        },
      }}
      onSubmit={async ({ projectMember: { userId, ...rest } }) => {
        const input = {
          projectMember: {
            userId: userId!.id,
            ...rest,
          },
        };

        await createProjectMember({ variables: { input } });
      }}
    >
      <SubmitError />
      <FormSpy>
        {({ values }) => {
          const formValues = values as DialogValues;
          const canRead = formValues.projectMember.userId?.roles.canRead;
          const userRoles = formValues.projectMember.userId?.roles.value;

          return (
            <FieldGroup prefix="projectMember">
              <UserField name="userId" required variant="outlined" />
              <AutocompleteField
                disabled={!canRead || !userRoles}
                multiple
                options={RoleList}
                getOptionLabel={displayRole}
                name="roles"
                label="Roles"
                getOptionDisabled={(option) =>
                  !!userRoles && !userRoles.includes(option)
                }
                variant="outlined"
              />
            </FieldGroup>
          );
        }}
      </FormSpy>
    </DialogForm>
  );
};
