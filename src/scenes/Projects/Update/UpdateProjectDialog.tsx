import { Typography } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import {
  displayProjectStep,
  displayStatus,
  ProjectStatus,
  ProjectStep,
  UpdateProjectInput,
} from '../../../api';
import { projectStepToStatusMap } from '../../../api/projectSteps';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { RadioField, RadioOption, SubmitError } from '../../../components/form';
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
      <RadioField name="project.step">
        {(Object.entries(projectStepToStatusMap) as Array<
          [ProjectStatus, ProjectStep[]]
        >).map(([status, stepsArr]) => (
          <>
            <Typography variant="h4">{displayStatus(status)}</Typography>
            {stepsArr.map((step) => (
              <RadioOption
                key={step}
                label={displayProjectStep(step)}
                value={step}
              />
            ))}
          </>
        ))}
      </RadioField>
    </DialogForm>
  );
};
