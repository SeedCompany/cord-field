import React from 'react';
import { Except } from 'type-fest';
import {
  displayProjectStep,
  displayStatus,
  UpdateProjectInput,
} from '../../../api';
import { projectStatusFromStep, projectSteps } from '../../../api/projectSteps';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { AutocompleteField } from '../../../components/form/AutocompleteField';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.generated';
import { useUpdateProjectMutation } from './UpdateProject.generated';

type UpdateProjectDialogProps = Except<
  DialogFormProps<UpdateProjectInput>,
  'onSubmit' | 'initialValues'
> & {
  project?: ProjectOverviewFragment;
};

export const UpdateProjectDialog = ({
  project,
  ...props
}: UpdateProjectDialogProps) => {
  const [updateProject] = useUpdateProjectMutation();

  return (
    <DialogForm<UpdateProjectInput>
      title="Update Project Step"
      closeLabel="Close"
      submitLabel="Save"
      onlyDirtySubmit
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      initialValues={{
        project: {
          id: project?.id || '',
          step: project?.step.value,
        },
      }}
      onSubmit={async (input) => {
        await updateProject({ variables: { input } });
      }}
    >
      <SubmitError />
      <AutocompleteField
        name="project.step"
        required
        options={projectSteps}
        groupBy={(step) => displayStatus(projectStatusFromStep[step])}
        getOptionLabel={displayProjectStep}
        variant="outlined"
        autoFocus
        openOnFocus
        autoComplete
      />
    </DialogForm>
  );
};
