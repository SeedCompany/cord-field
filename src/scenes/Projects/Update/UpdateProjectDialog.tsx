import { Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { Except } from 'type-fest';
import {
  displayProjectStep,
  displayStatus,
  UpdateProjectInput,
} from '../../../api';
import { projectStepToStatusMap } from '../../../api/projectSteps';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { RadioField, RadioOption, SubmitError } from '../../../components/form';
import { entries } from '../../../util';
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
        {entries(projectStepToStatusMap).map(([status, steps]) => (
          <Fragment key={status}>
            <Typography variant="h4">{displayStatus(status)}</Typography>
            {steps.map((step) => (
              <RadioOption
                key={step}
                label={displayProjectStep(step)}
                value={step}
              />
            ))}
          </Fragment>
        ))}
      </RadioField>
    </DialogForm>
  );
};
