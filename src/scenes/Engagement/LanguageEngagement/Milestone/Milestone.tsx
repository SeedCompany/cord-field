import { useMutation } from '@apollo/client';
import { Check, Clear, Edit } from '@mui/icons-material';
import { CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import {
  LanguageMilestone,
  LanguageMilestoneLabels,
  LanguageMilestoneList,
} from '~/api/schema.graphql';
import { SelectField } from '~/components/form';
import { IconButton } from '../../../../components/IconButton';
import { UpdateLanguageEngagementDocument } from '../../EditEngagement/EditEngagementDialog.graphql';
import { EngagementMilestoneReachedFragment } from './Milestone.graphql';

interface Props {
  engagement: EngagementMilestoneReachedFragment;
}

interface FormShape {
  milestoneReached: LanguageMilestone;
}

export const LanguageEngagementMilestone = ({ engagement }: Props) => {
  const { milestoneReached } = engagement;

  const [isEditing, setIsEditing] = useState(false);
  const [updateLanguageEngagement] = useMutation(
    UpdateLanguageEngagementDocument
  );

  const initialValues = useMemo(
    (): FormShape => ({
      milestoneReached: milestoneReached.value || 'Unknown',
    }),
    [milestoneReached]
  );

  if (!milestoneReached.canRead) {
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
          spacing={1}
          sx={{ mb: 4 }}
          component={isEditing ? 'form' : 'div'}
          onSubmit={handleSubmit}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3">Milestone Achieved</Typography>
            {!isEditing ? (
              milestoneReached.canEdit ? (
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
                    {submitting ? <CircularProgress size={24} /> : <Check />}
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
            Milestone product achieved upon successful completion of this
            engagement
          </Typography>
          {isEditing ? (
            <SelectField
              name="milestoneReached"
              label="Milestone"
              options={LanguageMilestoneList}
              getOptionLabel={(option) => LanguageMilestoneLabels[option]}
              defaultValue={milestoneReached.value}
              required
              sx={{ width: 'fit-content' }}
            />
          ) : milestoneReached.value && milestoneReached.value !== 'Unknown' ? (
            <Typography>
              {LanguageMilestoneLabels[milestoneReached.value]}
            </Typography>
          ) : (
            <Typography>
              Unknown{' '}
              {milestoneReached.canEdit && '— click the edit pencil to declare'}
            </Typography>
          )}
        </Stack>
      )}
    </Form>
  );
};
