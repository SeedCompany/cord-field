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
import { useUpdateProjectMemberMutation } from './UpdateProjectMember.generated';

interface DialogValues {
  projectMember: {
    id: string;
    roles?: Role[];
  };
}

type UpdateProjectMemberProps = Except<
  DialogFormProps<DialogValues>,
  'onSubmit' | 'initialValues'
> & {
  id: string;
};

const useStyles = makeStyles({
  container: {
    width: 400,
  },
});

export const UpdateProjectMember = ({
  id,
  ...props
}: UpdateProjectMemberProps) => {
  const classes = useStyles();
  const [updateProjectMember] = useUpdateProjectMemberMutation();

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
          roles: [],
        },
      }}
      onSubmit={async (input) => {
        // const input = {
        //   projectMember: {
        //     userId: userId!.id,
        //     ...rest,
        //   },
        // };

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
          //   getOptionDisabled={(option) =>
          //     !!userRoles && !userRoles.includes(option)
          //   }
          variant="outlined"
        />
      </Container>
    </DialogForm>
  );
};
