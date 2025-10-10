import { useMutation } from '@apollo/client';
import { Check, CheckCircle, Clear, Edit } from '@mui/icons-material';
import { CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { setOf } from '@seedcompany/common';
import { Decorator } from 'final-form';
import { difference } from 'lodash';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import {
  LanguageMilestone,
  LanguageMilestoneLabels,
  LanguageMilestoneList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
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

const actualMilestones = setOf<LanguageMilestone | undefined>(
  difference(LanguageMilestoneList, ['None', 'Unknown'])
);

const clearReached: Decorator<FormShape> = (form) => {
  let prevValues: Partial<FormShape> | undefined;
  return form.subscribe(
    ({ values, initialValues }) => {
      if (prevValues === undefined || prevValues !== initialValues) {
        prevValues = initialValues;
      }
      if (
        actualMilestones.has(prevValues.milestonePlanned) &&
        !actualMilestones.has(values.milestonePlanned)
      ) {
        form.change('milestoneReached', null);
      }
      prevValues = values;
    },
    { values: true, initialValues: true }
  );
};

const decorators = [clearReached];

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
      decorators={decorators}
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
      subscription={{ submitting: true, values: true }}
    >
      {({ handleSubmit, form, submitting, values }) => (
        <Stack
          spacing={1}
          component={isEditing ? 'form' : 'div'}
          onSubmit={handleSubmit}
        >
          {/* Header */}
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
            Completion of milestone translation goals within this MOU phase
          </Typography>

          <Stack direction="row" spacing={3} flexWrap="wrap">
            {/* Planned Field / View Display */}
            {isEditing && milestonePlanned.canEdit ? (
              <SelectField
                name="milestonePlanned"
                label="Milestone"
                options={LanguageMilestoneList}
                getOptionLabel={labelFrom(LanguageMilestoneLabels)}
                required
                fullWidth={false}
                sx={{ width: 175 }}
              />
            ) : milestonePlanned.value &&
              milestonePlanned.value !== 'Unknown' ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                {(() => {
                  const label = (
                    <Typography>
                      {LanguageMilestoneLabels[milestonePlanned.value]}
                    </Typography>
                  );
                  return milestoneReached.value === false ? (
                    <Strikethrough>{label}</Strikethrough>
                  ) : (
                    label
                  );
                })()}
                {milestoneReached.value === true ? (
                  <Tooltip title="Milestone has been completed">
                    <CheckCircle color="success" fontSize="small" />
                  </Tooltip>
                ) : milestoneReached.value === false ? (
                  <Tooltip title="Milestone was not completed">
                    <Clear color="error" />
                  </Tooltip>
                ) : null}
              </Stack>
            ) : (
              <Typography color="textSecondary">
                Unknown{' '}
                {milestonePlanned.canEdit &&
                  '— click the edit pencil to declare'}
              </Typography>
            )}

            {/* Reached Field */}
            {isEditing &&
              milestoneReached.canEdit &&
              actualMilestones.has(values.milestonePlanned) && (
                <TriStateBooleanField
                  name="milestoneReached"
                  label="Was it completed?"
                  helperText={false}
                  sx={{ width: 'fit-content' }}
                />
              )}
          </Stack>
        </Stack>
      )}
    </Form>
  );
};

const Strikethrough = styled('s')(({ theme }) => ({
  display: 'inline-block',
  textDecoration: 'none',
  position: 'relative',
  '&:after': {
    color: theme.palette.text.disabled,
    pointerEvents: 'none',
    content: '""',
    display: 'block',
    width: '100%',
    height: '60%', // manually positioned off vertical center to look better with the font
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottom: 'thin solid',
  },
}));
