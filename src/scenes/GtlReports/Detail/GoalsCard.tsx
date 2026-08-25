import { useMutation } from '@apollo/client';
import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { type RichTextJson } from '~/common';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  Form,
  SavingStatus,
  SubmitError,
  TextField,
} from '../../../components/form';
import { IconButton } from '../../../components/IconButton';
import { RichTextField, RichTextView } from '../../../components/RichText';
import {
  CreateGtlReportGoalDocument,
  DeleteGtlReportGoalDocument,
  type GtlGoalFragment,
  GtlReportDetailDocument,
  ReviewGtlReportGoalDocument,
} from './GtlReportDetail.graphql';

/**
 * Goals on a GTL report — the section that spans two quarters.
 *
 * The top half reviews last quarter's goals in place; the bottom half sets the
 * goals this report is committing to. They are the same rows a quarter apart,
 * which is why reviewing writes back rather than creating anything.
 */
export const GoalsCard = ({
  reportId,
  previousQuarterGoals,
  goals,
}: {
  reportId: string;
  previousQuarterGoals: readonly GtlGoalFragment[];
  goals: readonly GtlGoalFragment[];
}) => {
  const [addState, addGoal] = useDialog();

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Goals</Typography>
          <Button size="small" startIcon={<Add />} onClick={addGoal}>
            Add goal
          </Button>
        </Stack>

        <Typography variant="overline" color="text.secondary">
          From the previous quarter
        </Typography>
        {previousQuarterGoals.length === 0 ? (
          <Empty>No goals were carried forward into this quarter.</Empty>
        ) : (
          previousQuarterGoals.map((goal) => (
            <GoalReview key={goal.id} goal={goal} reportId={reportId} />
          ))
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="overline" color="text.secondary">
          Set for next quarter
        </Typography>
        {goals.length === 0 ? (
          <Empty>No goals set yet.</Empty>
        ) : (
          goals.map((goal) => <GoalRow key={goal.id} goal={goal} />)
        )}

        <AddGoalDialog {...addState} reportId={reportId} />
      </CardContent>
    </Card>
  );
};

/** Last quarter's goal, reviewed in place by this report. */
const GoalReview = ({
  goal,
  reportId,
}: {
  goal: GtlGoalFragment;
  reportId: string;
}) => {
  const [review] = useMutation(ReviewGtlReportGoalDocument);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1">{goal.goal.value}</Typography>
      {!goal.met.canEdit ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Chip
            size="small"
            label={goal.met.value ? 'Met' : 'Not met'}
            color={goal.met.value ? 'success' : 'default'}
          />
        </Stack>
      ) : (
        <Form<{ met?: boolean; impact?: RichTextJson }>
          onSubmit={async ({ met, impact }) => {
            await review({
              variables: {
                input: {
                  id: goal.id,
                  reviewedInReport: reportId,
                  // final-form leaves an untouched checkbox undefined.
                  met: met ?? false,
                  impact,
                },
              },
            });
          }}
          initialValues={{
            met: goal.met.value ?? false,
            impact: goal.impact.value ?? undefined,
          }}
          autoSubmit
          keepDirtyOnReinitialize
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <SubmitError />
              <CheckboxField name="met" label="Goal was met" />
              <RichTextField
                name="impact"
                label="Impact on the Global Leader and translation projects"
                helperText={<SavingStatus submitting={submitting} />}
              />
            </form>
          )}
        </Form>
      )}
      {!goal.impact.canEdit && goal.impact.value && (
        <RichTextView data={goal.impact.value} />
      )}
    </Box>
  );
};

/** A goal this report is setting for the coming quarter. */
const GoalRow = ({ goal }: { goal: GtlGoalFragment }) => {
  const [remove] = useMutation(DeleteGtlReportGoalDocument, {
    variables: { id: goal.id },
    refetchQueries: [GtlReportDetailDocument],
  });
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body1" sx={{ flex: 1 }}>
          {goal.goal.value}
        </Typography>
        {goal.goal.canEdit && (
          <IconButton size="small" onClick={() => void remove()}>
            <Delete fontSize="small" />
          </IconButton>
        )}
      </Stack>
      {goal.details.value && <RichTextView data={goal.details.value} />}
    </Box>
  );
};

const AddGoalDialog = ({
  reportId,
  ...props
}: { reportId: string } & ReturnType<typeof useDialog>[0]) => {
  const [create] = useMutation(CreateGtlReportGoalDocument, {
    refetchQueries: [GtlReportDetailDocument],
  });
  return (
    <DialogForm<{ goal: string; details?: RichTextJson }>
      {...props}
      title="Add a goal for next quarter"
      onSubmit={async ({ goal, details }) => {
        await create({
          variables: { input: { report: reportId, goal, details } },
        });
      }}
    >
      <SubmitError />
      <TextField
        name="goal"
        label="Goal"
        placeholder="What will be achieved in the next three months?"
        required
        autoFocus
      />
      <RichTextField
        name="details"
        label="Details"
        helperText="Where, when and how."
      />
    </DialogForm>
  );
};

const Empty = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" color="text.secondary" paragraph>
    {children}
  </Typography>
);
