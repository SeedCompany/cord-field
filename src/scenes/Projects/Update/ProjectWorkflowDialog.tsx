import { useMutation } from '@apollo/client';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Except } from 'type-fest';
import {
  ProjectStep,
  ProjectStepLabels,
  ProjectStepList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { transitionTypeStyles } from '~/common/transitionTypeStyles';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  SubmitAction,
  SubmitButton,
  SubmitError,
} from '../../../components/form';
import { AutocompleteField } from '../../../components/form/AutocompleteField';
import { Link } from '../../../components/Routing';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.graphql';
import { UpdateProjectDocument } from './UpdateProject.graphql';

type UpdateProjectDialogProps = Except<
  DialogFormProps<SubmitAction & { project?: { step?: ProjectStep } }>,
  'sendIfClean' | 'submitLabel' | 'onSubmit' | 'initialValues' | 'errorHandlers'
> & {
  project: ProjectOverviewFragment;
};

const useStyles = makeStyles()(({ spacing }) => ({
  overrideTitle: {
    marginTop: spacing(3),
  },
}));

export const ProjectWorkflowDialog = ({
  project,
  ...props
}: UpdateProjectDialogProps) => {
  const [updateProject] = useMutation(UpdateProjectDocument);
  const { classes } = useStyles();
  const { canBypassTransitions, transitions } = project.step;

  const step = project.step.value;
  return (
    <DialogForm
      title={
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mr: -1 }}
        >
          <span>Update Project</span>
          <Tooltip title="View Workflow">
            <IconButton
              component={Link}
              to={`/projects/workflow${step ? `?state=${step}` : ''}`}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      }
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
              `This will change the project step to ${
                ProjectStepLabels[transition.to]
              }`
            }
            key={i}
          >
            <Grid item>
              <SubmitButton
                {...transitionTypeStyles[transition.type]}
                // Ensure submit action/step is unique by appending index. This prevents
                // multiple spinners for the same next step with different labels.
                action={`${transition.to}:${i}`}
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
              getOptionLabel={labelFrom(ProjectStepLabels)}
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
