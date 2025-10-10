import { useMutation } from '@apollo/client';
import { Check, CheckCircle, Clear, Edit } from '@mui/icons-material';
import { CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import {
  LanguageMilestone,
  LanguageMilestoneLabels,
  LanguageMilestoneList,
} from '~/api/schema.graphql';
import { SelectField } from '~/components/form';
import { TriStateBooleanField } from '~/components/form/TriStateBooleanField';
import { IconButton } from '../../../../components/IconButton';
import { UpdateLanguageEngagementDocument } from '../../EditEngagement/EditEngagementDialog.graphql';
import { EngagementMilestoneReachedFragment } from './Milestone.graphql';

interface Props {
  engagement: EngagementMilestoneReachedFragment;
}

interface FormShape {
  milestonePlanned: LanguageMilestone;
  milestoneReached: boolean | null;
}

export const LanguageEngagementMilestone = ({ engagement }: Props) => {
  const { milestonePlanned, milestoneReached } = engagement;

  const [isEditing, setIsEditing] = useState(false);
  const [updateLanguageEngagement] = useMutation(
    UpdateLanguageEngagementDocument
  );

  const initialValues = useMemo(
    (): FormShape => ({
      milestonePlanned: milestonePlanned.value || 'Unknown',
      milestoneReached: milestoneReached.value ?? null,
    }),
    [milestonePlanned, milestoneReached]
  );

  if (!milestonePlanned.canRead) {
    return null;
  }

  return (
    <Form<FormShape>
      initialValues={initialValues}
      onSubmit={async (values, form) => {
        if (form.getState().dirty) {
          await updateLanguageEngagement({
            variables: {
              input: {
                engagement: {
                  id: engagement.id,
                  milestonePlanned: values.milestonePlanned,
                  milestoneReached: values.milestoneReached,
                },
              },
            },
          });
        }

        setIsEditing(false);
      }}
      subscription={{ submitting: true }}
    >
      {({ handleSubmit, form, submitting }) => (
        <Stack
          spacing={3}
          sx={{ mb: 4 }}
          component={isEditing ? 'form' : 'div'}
          onSubmit={handleSubmit}
        >
          {/* Milestone Planned Section */}
          {milestonePlanned.canRead && (
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h3">Milestone Planned</Typography>
                {!isEditing ? (
                  milestonePlanned.canEdit || milestoneReached.canEdit ? (
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => setIsEditing(true)}
                        aria-label="edit milestone"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  ) : null
                ) : (
                  <>
                    <Tooltip title="Save">
                      <IconButton
                        color="success"
                        disabled={submitting}
                        type="submit"
                      >
                        {submitting ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Check />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <IconButton
                        color="error"
                        disabled={submitting}
                        onClick={() => {
                          setIsEditing(false);
                          form.reset();
                        }}
                      >
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Stack>
              <Typography variant="body2" color="textSecondary">
                Completion of milestone translation goals within this MOU phase
              </Typography>
              {isEditing && milestonePlanned.canEdit ? (
                <SelectField
                  name="milestonePlanned"
                  label="Milestone Planned"
                  options={LanguageMilestoneList}
                  getOptionLabel={(option) => LanguageMilestoneLabels[option]}
                  defaultValue={milestonePlanned.value}
                  required
                  sx={{ width: 'fit-content' }}
                />
              ) : milestonePlanned.value &&
                milestonePlanned.value !== 'Unknown' ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>
                    {LanguageMilestoneLabels[milestonePlanned.value]}
                  </Typography>
                  {milestoneReached.value === true && (
                    <Tooltip title="Milestone has been completed in this engagement">
                      <CheckCircle color="success" fontSize="large" />
                    </Tooltip>
                  )}
                </Stack>
              ) : (
                <Typography>
                  Unknown{' '}
                  {milestonePlanned.canEdit &&
                    '— click the edit pencil to declare'}
                </Typography>
              )}
              {isEditing && milestoneReached.canEdit && (
                <TriStateBooleanField
                  name="milestoneReached"
                  label="Was the milestone reached in this engagement?"
                  sx={{ width: 'fit-content' }}
                />
              )}
            </Stack>
          )}
        </Stack>
      )}
    </Form>
  );
};
