import { useMutation, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { onUpdateInvalidateObject, onUpdateInvalidateProps } from '~/api';
import {
  RoleLabels,
  RoleList,
  UpdateProjectMember as UpdateProjectMemberShape,
} from '~/api/schema.graphql';
import { callAll, labelFrom } from '~/common';
import { ProjectIdFragment } from '~/common/fragments';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import {
  AutocompleteField,
  DateField,
  SecuredField,
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../../components/form';
import { ProjectMemberCardFragment } from '../../../../components/ProjectMemberCard/ProjectMember.graphql';
import { useSession } from '../../../../components/Session';
import {
  DeleteProjectMemberDocument,
  GetUserRolesDocument,
  UpdateProjectMemberDocument,
} from './UpdateProjectMember.graphql';

type FormShape = UpdateProjectMemberShape & SubmitAction<'delete'>;

export type UpdateProjectMemberProps = Except<
  DialogFormProps<FormShape>,
  'onSubmit' | 'initialValues'
> & {
  member: ProjectMemberCardFragment;
  project: ProjectIdFragment;
};

export const UpdateProjectMember = ({
  project,
  member,
  ...props
}: UpdateProjectMemberProps) => {
  const { session } = useSession();
  const [updateProjectMember] = useMutation(UpdateProjectMemberDocument);

  const { data, loading } = useQuery(GetUserRolesDocument, {
    variables: {
      userId: member.user.value?.id ?? '',
    },
    skip: !member.user.value,
  });
  const availableRoles = data?.user.roles.availableForProjects ?? [];

  const invalidateMemberLists = onUpdateInvalidateProps(
    project,
    'team',
    // @ts-expect-error this is an alias used here:
    // https://github.com/SeedCompany/cord-field/blob/master/src/components/ProjectMembersSummary/ProjectMembersSummary.graphql#L3
    'activeMembers'
  );
  const [deleteProjectMember] = useMutation(DeleteProjectMemberDocument, {
    variables: {
      projectMemberId: member.id,
    },
    update: callAll(
      session?.id === member.user.value?.id
        ? // Invalidate the whole project if removing self as that can have major authorization implications
          onUpdateInvalidateObject(project)
        : invalidateMemberLists
    ),
  });

  const initialValues = useMemo(
    (): FormShape => ({
      id: member.id,
      roles: member.roles.value,
      inactiveAt: member.inactiveAt.value ?? null,
    }),
    [member]
  );

  return (
    <DialogForm<FormShape>
      title="Update Team Member"
      closeLabel="Close"
      submitLabel="Save"
      sendIfClean="delete"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({ submitAction, ...input }, form) => {
        const dirty = form.getState().dirtyFields;
        const activeChange = 'inactiveAt' in dirty;
        if (submitAction === 'delete') {
          await deleteProjectMember();
          return;
        }
        await updateProjectMember({
          variables: { input },
          update: activeChange ? invalidateMemberLists : undefined,
        });
      }}
      leftAction={
        member.canDelete && (
          <SubmitButton
            action="delete"
            color="error"
            fullWidth={false}
            variant="text"
          >
            Delete
          </SubmitButton>
        )
      }
    >
      <SubmitError />

      <AutocompleteField
        loading={loading}
        fullWidth
        multiple
        options={loading ? [] : RoleList}
        getOptionLabel={labelFrom(RoleLabels)}
        name="roles"
        label="Roles"
        getOptionDisabled={(option) => !availableRoles.includes(option)}
        variant="outlined"
      />

      <SecuredField obj={member} name="inactiveAt">
        {(props) => (
          <DateField
            {...props}
            label="Ended On"
            helperText="When the person's membership on the project ended"
            variant="outlined"
            allowNull
            openTo="day"
          />
        )}
      </SecuredField>
    </DialogForm>
  );
};
