import { Container } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { Except } from 'type-fest';
import {
  displayRole,
  GQLOperations,
  Role,
  RoleList,
  UpdateProjectMemberInput,
} from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitButton, SubmitError } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import {
  useDeleteProjectMemberMutation,
  useGetUserRolesQuery,
  useUpdateProjectMemberMutation,
} from './UpdateProjectMember.generated';

export interface UpdateProjectMemberFormParams {
  projectMemberId: string;
  userId: string;
  userRoles: readonly Role[];
  projectId: string;
}
type UpdateProjectMemberProps = Except<
  DialogFormProps<UpdateProjectMemberInput>,
  'onSubmit' | 'initialValues'
> &
  UpdateProjectMemberFormParams;

export const UpdateProjectMember = ({
  projectMemberId,
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
    refetchQueries: [GQLOperations.Query.ProjectMembers],
    awaitRefetchQueries: true,
  });

  const availableRoles = data?.user.roles.value ?? [];
  return (
    <DialogForm<UpdateProjectMemberInput>
      title="Update Team Member Role"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      initialValues={{
        projectMember: {
          id: projectMemberId,
          roles: userRoles,
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
                projectMemberId,
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
