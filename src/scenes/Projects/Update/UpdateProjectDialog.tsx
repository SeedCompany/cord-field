import { Typography } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import { displayProjectStep, UpdateProjectInput } from '../../../api';
import { projectStepToStatusMap } from '../../../api/projectSteps';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { RadioField, RadioOption, SubmitError } from '../../../components/form';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.generated';
import { useUpdateProjectMutation } from './UpdateProject.generated';

type UpdateProjectStepDialogProps = Except<
  DialogFormProps<UpdateProjectInput>,
  'onSubmit' | 'initialValues'
> & {
  project?: ProjectOverviewFragment;
};

export const UpdateProjectStepDialog = ({
  project,
  ...props
}: UpdateProjectStepDialogProps) => {
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
        <Typography variant="h4">In Development</Typography>
        {projectStepToStatusMap.InDevelopment.map((step) => (
          <RadioOption
            key={step}
            label={displayProjectStep(step)}
            value={step}
          />
        ))}
        <Typography variant="h4">Pending</Typography>
        {projectStepToStatusMap.Pending.map((step) => (
          <RadioOption
            key={step}
            label={displayProjectStep(step)}
            value={step}
          />
        ))}
        <Typography variant="h4">Active</Typography>
        {projectStepToStatusMap.Active.map((step) => (
          <RadioOption
            key={step}
            label={displayProjectStep(step)}
            value={step}
          />
        ))}
        <Typography variant="h4">Stopped</Typography>
        {projectStepToStatusMap.Stopped.map((step) => (
          <RadioOption
            key={step}
            label={displayProjectStep(step)}
            value={step}
          />
        ))}
        <Typography variant="h4">Finished</Typography>
        {projectStepToStatusMap.Finished.map((step) => (
          <RadioOption
            key={step}
            label={displayProjectStep(step)}
            value={step}
          />
        ))}
      </RadioField>
    </DialogForm>
  );
};
