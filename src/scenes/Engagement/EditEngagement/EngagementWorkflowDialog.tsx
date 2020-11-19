import { useMutation } from '@apollo/client';
import { Grid, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import {
  displayEngagementStatus,
  EngagementStatus,
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
import { Engagement } from './EditEngagementDialog';
import {
  UpdateInternshipEngagementDocument,
  UpdateLanguageEngagementDocument,
} from './EditEngagementDialog.generated';

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
  engagement: Engagement;
};

export const EngagementWorkflowDialog = ({
  engagement,
  ...props
}: UpdateProjectDialogProps) => {
  const [updateInternshipEngagement] = useMutation(
    UpdateInternshipEngagementDocument
  );
  const [updateLanguageEngagement] = useMutation(
    UpdateLanguageEngagementDocument
  );
  const updateEngagement =
    engagement.__typename === 'InternshipEngagement'
      ? updateInternshipEngagement
      : updateLanguageEngagement;

  return (
    <DialogForm
      title="Update Engagement"
      closeLabel="Close"
      {...props}
      submitLabel={false}
      sendIfClean
      onSubmit={async ({ submitAction }) => {
        await updateEngagement({
          variables: {
            input: {
              engagement: {
                id: engagement.id,
                // remove index suffix used to make submit action unique
                status: submitAction!.split(':')[0] as EngagementStatus,
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
        {engagement.status.transitions.map((transition, i) => (
          <Tooltip
            title={`This will change the engagement status to ${displayEngagementStatus(
              transition.to
            )}`}
            key={i}
          >
            <Grid item>
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
          </Tooltip>
        ))}
        {engagement.status.transitions.length === 0 && (
          <>
            <Typography color="textSecondary" paragraph>
              The status of this engagement is unable to be changed.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You do not have permission to change to any of the next available
              steps or the engagement has reached its terminal status.
            </Typography>
          </>
        )}
      </Grid>
    </DialogForm>
  );
};
