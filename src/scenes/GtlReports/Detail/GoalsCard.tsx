import { useMutation } from '@apollo/client';
import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  type GtlGoalMeasurement,
  type GtlGoalStatus,
} from '~/api/schema.graphql';
import {
  GtlGoalMeasurementLabels,
  GtlGoalMeasurementList,
  GtlGoalStatusLabels,
  GtlGoalStatusList,
} from '~/api/schema/enumLists';
import { type CalendarDate, labelFrom, type RichTextJson } from '~/common';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import {
  DateField,
  EnumField,
  EnumOption,
  Form,
  NumberField,
  SavingStatus,
  SubmitError,
  TextField,
} from '../../../components/form';
import { FormattedDate } from '../../../components/Formatters';
import { IconButton } from '../../../components/IconButton';
import { RichTextField, RichTextView } from '../../../components/RichText';
import {
  CreateGtlGoalDocument,
  DeleteGtlGoalDocument,
  type GtlGoalFragment,
  type GtlGoalProgressFragment,
  GtlReportDetailDocument,
  ReportGtlGoalProgressDocument,
} from './GtlReportDetail.graphql';

/**
 * The growth plan, as worked on from one quarter's report.
 *
 * Goals belong to the engagement and usually outlive the quarter, so this shows
 * every goal on the plan and lets the report say what moved on each. Adding a
 * goal here records that it was first proposed in this report.
 */
export const GoalsCard = ({
  reportId,
  engagementId,
  goals,
  progress,
  editable = true,
}: {
  reportId: string;
  engagementId?: string;
  goals: readonly GtlGoalFragment[];
  progress: readonly GtlGoalProgressFragment[];
  editable?: boolean;
}) => {
  const [addState, addGoal] = useDialog();
  const progressByGoal = new Map(progress.map((p) => [p.goal.id, p]));

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Goals</Typography>
          {editable && engagementId && (
            <Button size="small" startIcon={<Add />} onClick={addGoal}>
              Add goal
            </Button>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" paragraph>
          The leader’s growth plan. Say what moved on each goal this quarter.
        </Typography>

        {goals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No goals yet.
          </Typography>
        ) : (
          goals.map((goal) => (
            <GoalRow
              key={goal.id}
              goal={goal}
              reportId={reportId}
              entry={progressByGoal.get(goal.id)}
              editable={editable}
            />
          ))
        )}

        {editable && engagementId && (
          <AddGoalDialog
            {...addState}
            engagementId={engagementId}
            reportId={reportId}
          />
        )}
      </CardContent>
    </Card>
  );
};

const GoalRow = ({
  goal,
  reportId,
  entry,
  editable,
}: {
  goal: GtlGoalFragment;
  reportId: string;
  entry?: GtlGoalProgressFragment;
  editable: boolean;
}) => {
  const [report] = useMutation(ReportGtlGoalProgressDocument);
  const [remove] = useMutation(DeleteGtlGoalDocument, {
    variables: { id: goal.id },
    refetchQueries: [GtlReportDetailDocument],
  });

  const measurement = goal.measurement.value;
  const target =
    measurement === 'Number' ? goal.targetNumber.value ?? undefined : undefined;

  return (
    <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body1" sx={{ flex: 1 }}>
          {goal.goal.value}
        </Typography>
        <GoalStatusChip goal={goal} />
        {editable && goal.goal.canEdit && (
          <IconButton size="small" onClick={() => void remove()}>
            <Delete fontSize="small" />
          </IconButton>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {measurement === 'Number' && target
          ? `${goal.progressValue.value ?? 0} of ${target}${
              goal.targetDescription.value
                ? ` ${goal.targetDescription.value}`
                : ''
            }`
          : labelFrom(GtlGoalMeasurementLabels)(measurement)}
        {goal.targetDate.value && (
          <>
            {' · due '}
            <FormattedDate date={goal.targetDate.value} />
          </>
        )}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={goal.percentComplete}
        sx={{ my: 1, maxWidth: 320 }}
      />

      {goal.details.value && <RichTextView data={goal.details.value} />}

      {!editable ? (
        entry?.notes.value && <RichTextView data={entry.notes.value} />
      ) : (
        <Form<{
          status?: GtlGoalStatus;
          progressValue?: number | null;
          notes?: RichTextJson;
        }>
          onSubmit={async (values) => {
            if (!values.status) return;
            await report({
              variables: {
                input: {
                  goal: goal.id,
                  report: reportId,
                  status: values.status,
                  progressValue: values.progressValue,
                  notes: values.notes,
                },
              },
            });
          }}
          initialValues={{
            status: entry?.status.value ?? goal.status.value ?? undefined,
            progressValue: entry?.progressValue.value ?? undefined,
            notes: entry?.notes.value ?? undefined,
          }}
          autoSubmit
          keepDirtyOnReinitialize
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <EnumField name="status" label="This quarter" required>
                  {GtlGoalStatusList.map((option) => (
                    <EnumOption
                      key={option}
                      value={option}
                      label={labelFrom(GtlGoalStatusLabels)(option)}
                    />
                  ))}
                </EnumField>
                {measurement !== 'Boolean' && (
                  <NumberField
                    name="progressValue"
                    label={measurement === 'Percent' ? 'Percent' : 'Count'}
                    sx={{ maxWidth: 140 }}
                  />
                )}
              </Stack>
              <RichTextField
                name="notes"
                label="What happened"
                helperText={<SavingStatus submitting={submitting} />}
              />
            </form>
          )}
        </Form>
      )}
    </Box>
  );
};

const GoalStatusChip = ({ goal }: { goal: GtlGoalFragment }) => {
  const status = goal.status.value;
  const behind = goal.scheduleStatus === 'Behind';
  return (
    <Stack direction="row" spacing={0.5}>
      <Chip
        size="small"
        label={status ? labelFrom(GtlGoalStatusLabels)(status) : '—'}
        color={
          status === 'Done'
            ? 'success'
            : status === 'AtRisk'
            ? 'warning'
            : 'default'
        }
      />
      {behind && <Chip size="small" label="Behind" color="error" />}
    </Stack>
  );
};

const AddGoalDialog = ({
  engagementId,
  reportId,
  ...props
}: {
  engagementId: string;
  reportId: string;
} & ReturnType<typeof useDialog>[0]) => {
  const [create] = useMutation(CreateGtlGoalDocument, {
    refetchQueries: [GtlReportDetailDocument],
  });
  return (
    <DialogForm<{
      goal: string;
      details?: RichTextJson;
      targetDate?: CalendarDate;
      measurement?: GtlGoalMeasurement;
      targetNumber?: number;
      targetDescription?: string;
    }>
      {...props}
      title="Add a goal"
      initialValues={{ measurement: 'Boolean' }}
      onSubmit={async (values) => {
        const measurement = values.measurement ?? 'Boolean';
        await create({
          variables: {
            input: {
              engagement: engagementId,
              setInReport: reportId,
              goal: values.goal,
              details: values.details,
              targetDate: values.targetDate,
              measurement,
              // Only a counted goal carries a target; the API rejects the rest.
              targetNumber:
                measurement === 'Number' ? values.targetNumber : undefined,
              targetDescription:
                measurement === 'Number' ? values.targetDescription : undefined,
            },
          },
        });
      }}
    >
      {({ values }) => (
        <>
          <SubmitError />
          <TextField
            name="goal"
            label="Goal"
            placeholder="What is this leader working toward?"
            required
            autoFocus
          />
          <RichTextField
            name="details"
            label="Details"
            helperText="Where, when and how."
          />
          <DateField name="targetDate" label="Target completion date" />
          <EnumField name="measurement" label="Track progress by" required>
            {GtlGoalMeasurementList.map((option) => (
              <EnumOption
                key={option}
                value={option}
                label={labelFrom(GtlGoalMeasurementLabels)(option)}
              />
            ))}
          </EnumField>
          {values.measurement === 'Number' && (
            <>
              <NumberField name="targetNumber" label="Target" required />
              <TextField
                name="targetDescription"
                label="What is being counted"
                placeholder="e.g. workshops facilitated"
              />
            </>
          )}
        </>
      )}
    </DialogForm>
  );
};
