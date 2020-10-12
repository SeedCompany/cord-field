import { Grid } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import { ProjectStep, TransitionType } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  SubmitAction,
  SubmitButton,
  SubmitButtonProps,
  SubmitError,
} from '../../../components/form';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.generated';
import { useUpdateProjectMutation } from './UpdateProject.generated';

const transitionTypeToColor: Record<
  TransitionType,
  SubmitButtonProps['color']
> = {
  Approve: 'primary',
  Neutral: 'secondary',
  Reject: 'error',
};

type UpdateProjectDialogProps = Except<
  DialogFormProps<SubmitAction>,
  'sendIfClean' | 'submitLabel' | 'onSubmit' | 'initialValues' | 'errorHandlers'
> & {
  project: ProjectOverviewFragment;
};

export const ProjectWorkflowDialog = ({
  project,
  ...props
}: UpdateProjectDialogProps) => {
  const [updateProject] = useUpdateProjectMutation();

  return (
    <DialogForm
      title="Update Project"
      closeLabel="Close"
      {...props}
      submitLabel={false}
      sendIfClean
      onSubmit={async ({ submitAction }) => {
        await updateProject({
          variables: {
            input: {
              project: {
                id: project.id,
                // remove index suffix used to make submit action unique
                step: submitAction!.split(':')[0] as ProjectStep,
              },
            },
          },
        });
      }}
      errorHandlers={{
        // ignore field since we don't use fields for this form
        Input: (e) => e.message,
      }}
    >
      <SubmitError />
      <Grid container direction="column" spacing={1}>
        {project.step.transitions.map((transition, i) => (
          <Grid item key={i}>
            <SubmitButton
              // Ensure submit action/step is unique by appending index. This prevents
              // multiple spinners for the same next step with different labels.
              action={`${transition.to}:${i}`}
              color={transitionTypeToColor[transition.type]}
              variant={transition.type === 'Approve' ? 'contained' : 'text'}
            >
              {transition.label}
            </SubmitButton>
          </Grid>
        ))}
      </Grid>
    </DialogForm>
  );
};
