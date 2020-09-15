import { Container } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { Except } from 'type-fest';
import { displayRole, Role, RoleList } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitButton, SubmitError } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { ProjectMembersDocument } from '../List/ProjectMembers.generated';
import {
  useDeleteProjectMemberMutation,
  useGetUserRolesQuery,
  useUpdateProjectMemberMutation,
} from './UpdateProjectMember.generated';

interface DialogValues {
  projectMember: {
    id: string;
    roles?: readonly Role[];
  };
}

type UpdateProjectMemberProps = Except<
  DialogFormProps<DialogValues>,
  'onSubmit' | 'initialValues'
> & {
  id: string;
  userId: string;
  userRoles?: readonly Role[];
  projectId: string;
};

export const UpdateProjectMember = ({
  id,
  userId,
  userRoles,
  projectId,
  ...props
}: UpdateProjectMemberProps) => {
  const [updateProjectMember] = useUpdateProjectMemberMutation();

  const { data, loading } = useGetUserRolesQuery({
    variables: {
      userId,
    },
  });

  const [deleteProjectMember] = useDeleteProjectMemberMutation({
    refetchQueries: [
      {
        query: ProjectMembersDocument,
        variables: { input: projectId },
      },
    ],
    awaitRefetchQueries: true,
  });

  const availableRoles = data?.user.roles.value ?? [];
  return (
    <DialogForm<DialogValues>
      title="Update Team Member Role"
      closeLabel="Close"
      submitLabel="Save"
      onlyDirtySubmit
      {...props}
      initialValues={{
        projectMember: {
          id,
          roles: userRoles ?? [],
        },
      }}
      onSubmit={async (input) => {
        await updateProjectMember({ variables: { input } });
      }}
      fieldsPrefix="projectMember"
      leftAction={
        <SubmitButton
          action="delete"
          color="error"
          fullWidth={false}
          variant="text"
          onClick={async () => {
            await deleteProjectMember({
              variables: {
                projectMemberId: id,
              },
            });
          }}
        >
          Delete
        </SubmitButton>
      }
    >
      <Container>
        <SubmitError />

        {loading ? (
          <Skeleton />
        ) : (
          <AutocompleteField
            fullWidth
            multiple
            options={RoleList}
            getOptionLabel={displayRole}
            name="roles"
            label="Roles"
            getOptionDisabled={(option) => !availableRoles.includes(option)}
            variant="outlined"
          />
        )}
      </Container>
    </DialogForm>
  );
};
