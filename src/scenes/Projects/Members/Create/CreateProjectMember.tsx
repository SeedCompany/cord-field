import React, { useMemo } from 'react';
import { FormSpy } from 'react-final-form';
import { Except, Merge } from 'type-fest';
import {
  CreateProjectMember as CreateProjectMemberInput,
  displayRole,
  RoleList,
} from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { FieldGroup, SubmitError } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { UserField, UserLookupItem } from '../../../../components/form/Lookup';
import { ProjectMembersDocument } from '../List/ProjectMembers.generated';
import { useCreateProjectMemberMutation } from './CreateProjectMember.generated';

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

  const initialValues = useMemo(
    () => ({
      projectMember: {
        projectId,
      },
    }),
    [projectId]
  );

  return (
    <DialogForm<FormValues>
      title="Add Team Member"
      {...props}
      initialValues={initialValues}
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
    >
      <SubmitError />
      <FormSpy<FormValues> subscription={{ values: true }}>
        {({ values }) => {
          const user = values.projectMember.userId;
          const canRead = user?.roles.canRead;
          const userRoles = user?.roles.value;

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
            </FieldGroup>
          );
        }}
      </FormSpy>
    </DialogForm>
  );
};
