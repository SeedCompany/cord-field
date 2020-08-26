import { Container, makeStyles } from '@material-ui/core';
import React from 'react';
import { FormSpy } from 'react-final-form';
import { Except } from 'type-fest';
import { displayRole, Role } from '../../../../api';
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

const Roles: Role[] = [
  'BibleTranslationLiaison',
  'Consultant',
  'ConsultantManager',
  'Controller',
  'Development',
  'ExecutiveDevelopmentRepresentative',
  'ExecutiveLeadership',
  'FieldOperationsDirector',
  'FieldPartner',
  'FinancialAnalyst',
  'Intern',
  'Liaison',
  'LeadFinancialAnalyst',
  'Mentor',
  'OfficeOfThePresident',
  'ProjectManager',
  'RegionalCommunicationsCoordinator',
  'RegionalDirector',
  'SupportingProjectManager',
  'Translator',
  'Writer',
];

const useStyles = makeStyles({
  container: {
    width: 400,
  },
});

export const CreateProjectMember = ({
  projectId,
  ...props
}: CreateProjectMemberProps) => {
  const classes = useStyles();
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
      closeLabel="Close"
      submitLabel="Save"
      onlyDirtySubmit
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
      <Container className={classes.container}>
        <SubmitError />
        <FormSpy>
          {({ values }) => {
            const formValues = values as DialogValues;
            const canRead = formValues.projectMember.userId?.roles.canRead;
            const userRoles = formValues.projectMember.userId?.roles.value;

            return (
              <FieldGroup prefix="projectMember">
                <UserField
                  name="userId"
                  label="Team member"
                  required
                  variant="outlined"
                  fullWidth
                />
                <AutocompleteField
                  fullWidth
                  disabled={!canRead || !userRoles}
                  multiple
                  options={Roles}
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
      </Container>
    </DialogForm>
  );
};
