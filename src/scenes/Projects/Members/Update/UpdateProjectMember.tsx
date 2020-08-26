import { Container, makeStyles } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import { displayRole, Role, Roles } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import {
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
};

const useStyles = makeStyles({
  container: {
    width: 400,
  },
});

export const UpdateProjectMember = ({
  id,
  userId,
  userRoles,
  ...props
}: UpdateProjectMemberProps) => {
  const classes = useStyles();
  const [updateProjectMember] = useUpdateProjectMemberMutation();

  const { data } = useGetUserRolesQuery({
    variables: {
      userId,
    },
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
    >
      <Container className={classes.container}>
        <SubmitError />
        <AutocompleteField
          fullWidth
          multiple
          options={Roles}
          getOptionLabel={displayRole}
          name="projectMember.roles"
          label="Roles"
          getOptionDisabled={(option) => !availableRoles.includes(option)}
          variant="outlined"
        />
      </Container>
    </DialogForm>
  );
};
