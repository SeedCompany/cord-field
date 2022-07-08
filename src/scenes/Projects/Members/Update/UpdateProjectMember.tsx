import { useMutation, useQuery } from '@apollo/client';
import { Container } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { Except } from 'type-fest';
import { removeItemFromList } from '~/api';
import {
  RoleLabels,
  RoleList,
  UpdateProjectMemberInput,
} from '~/api/schema.graphql';
import { callAll, labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import {
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { ProjectMembersQuery } from '../List/ProjectMembers.graphql';
import {
  DeleteProjectMemberDocument,
  GetUserRolesDocument,
  UpdateProjectMemberDocument,
} from './UpdateProjectMember.graphql';

export interface UpdateProjectMemberFormParams {
  project: ProjectMembersQuery['project'];
  projectMemberId: UpdateProjectMemberInput['projectMember']['id'];
  userId: string;
  userRoles: UpdateProjectMemberInput['projectMember']['roles'];
}

type FormShape = UpdateProjectMemberInput & SubmitAction<'delete'>;

type UpdateProjectMemberProps = Except<
  DialogFormProps<UpdateProjectMemberInput>,
  'onSubmit' | 'initialValues'
> &
  UpdateProjectMemberFormParams;

export const UpdateProjectMember = ({
  project,
  projectMemberId,
  userId,
  userRoles,
  ...props
}: UpdateProjectMemberProps) => {
  const [updateProjectMember] = useMutation(UpdateProjectMemberDocument);

  const { data, loading } = useQuery(GetUserRolesDocument, {
    variables: {
      userId,
    },
  });

  const [deleteProjectMember] = useMutation(DeleteProjectMemberDocument, {
    update: callAll(
      removeItemFromList({
        listId: 'projectMembers',
        item: { id: projectMemberId },
      }),
      removeItemFromList({
        listId: [project, 'team'],
        item: { id: projectMemberId },
      })
    ),
  });

  const availableRoles = data?.user.roles.value ?? [];
  return (
    <DialogForm<FormShape>
      title="Update Team Member Role"
      closeLabel="Close"
      submitLabel="Save"
      sendIfClean="delete"
      {...props}
      initialValues={{
        projectMember: {
          id: projectMemberId,
          roles: userRoles,
        },
      }}
      onSubmit={async (input) => {
        if (input.submitAction === 'delete') {
          await deleteProjectMember({
            variables: {
              projectMemberId,
            },
          });
          return;
        }
        await updateProjectMember({ variables: { input } });
      }}
      fieldsPrefix="projectMember"
      leftAction={
        <SubmitButton
          action="delete"
          color="error"
          fullWidth={false}
          variant="text"
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
            getOptionLabel={labelFrom(RoleLabels)}
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
