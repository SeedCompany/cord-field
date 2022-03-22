import { useMutation } from '@apollo/client';
import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import {
  displayProjectStep,
  ProjectStep,
  ProjectStepList,
  TransitionType,
} from '../../../api';
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
import { AutocompleteField } from '../../../components/form/AutocompleteField';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.graphql';
import { UpdateProjectDocument } from './UpdateProject.graphql';

const transitionTypeToColor: Record<
  TransitionType,
  SubmitButtonProps['color']
> = {
  Approve: 'primary',
  Neutral: 'secondary',
  Reject: 'error',
};

type UpdateProjectDialogProps = Except<
  DialogFormProps<SubmitAction & { project?: { step?: ProjectStep } }>,
  'sendIfClean' | 'submitLabel' | 'onSubmit' | 'initialValues' | 'errorHandlers'
> & {
  project: ProjectOverviewFragment;
};

const useStyles = makeStyles(({ spacing }) => ({
  overrideTitle: {
    marginTop: spacing(3),
  },
}));

export const ProjectWorkflowDialog = ({
  project,
  ...props
}: UpdateProjectDialogProps) => {
  const [updateProject] = useMutation(UpdateProjectDocument);
  const classes = useStyles();
  const { canBypassTransitions, transitions } = project.step;

  return (
    <DialogForm
      title="Update Project"
      closeLabel="Close"
      {...props}
      submitLabel={canBypassTransitions ? undefined : false}
      sendIfClean
      changesetAware
      onSubmit={async ({ submitAction, project: submittedProjectFields }) => {
        const step = submittedProjectFields?.step;
        // If clicking save for step override, but there is no step, do nothing.
        if (!submitAction && !step) {
          return;
        }

        await updateProject({
          variables: {
            input: {
              project: {
                id: project.id,
                // remove index suffix used to make submit action unique
                step:
                  (submitAction?.split(':')[0] as ProjectStep | null) ?? step,
              },
              changeset: project.changeset?.id,
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
        {transitions.map((transition, i) => (
          <Tooltip
            title={
              transition.disabledReason ??
              `This will change the project step to ${displayProjectStep(
                transition.to
              )}`
            }
            key={i}
          >
            <Grid item>
              <SubmitButton
                // Ensure submit action/step is unique by appending index. This prevents
                // multiple spinners for the same next step with different labels.
                action={`${transition.to}:${i}`}
                color={transitionTypeToColor[transition.type]}
                variant={transition.type === 'Approve' ? 'contained' : 'text'}
                disabled={transition.disabled}
              >
                {transition.label}
              </SubmitButton>
            </Grid>
          </Tooltip>
        ))}
        {canBypassTransitions ? (
          <>
            {transitions.length > 0 ? (
              <Typography
                color="textSecondary"
                className={classes.overrideTitle}
              >
                Or you can bypass these transitions
              </Typography>
            ) : (
              <Typography color="textSecondary">
                The status of this project doesn't have any available
                transitions. However, you are allowed to bypass this to set any
                step.
              </Typography>
            )}
            <AutocompleteField
              name="project.step"
              label="Override Step"
              options={ProjectStepList}
              getOptionLabel={displayProjectStep}
            />
          </>
        ) : (
          transitions.length === 0 && (
            <>
              <Typography color="textSecondary" paragraph>
                The status of this project is unable to be changed.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You do not have permission to change to any of the next
                available steps or the project has reached its terminal status.
              </Typography>
            </>
          )
        )}
      </Grid>
    </DialogForm>
  );
};
