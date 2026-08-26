import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  GtlGoalMeasurementLabels,
  GtlGoalStatusLabels,
} from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { FormattedDate } from '../../../components/Formatters';
import { RichTextView } from '../../../components/RichText';
import { type InternshipEngagementDetailFragment } from './InternshipEngagement.graphql';

type GoalSummary = InternshipEngagementDetailFragment['goalSummary'];
type Goal = GoalSummary['goals'][number];

/**
 * The growth plan at a glance: every goal this Global Translation Leader has
 * set, and how they are tracking against them.
 *
 * A goal belongs to the engagement rather than to the quarter that proposed it,
 * so this is the whole plan — the reports only record what moved. "Behind"
 * compares progress against time left before the target date, which is why a
 * goal can be in progress and behind at the same time.
 */
export const GrowthPlanTab = ({
  engagement,
}: {
  engagement: InternshipEngagementDetailFragment;
}) => {
  const plan = engagement.goalSummary;

  return (
    <Stack spacing={3} sx={{ maxWidth: 760 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" paragraph>
            Progress toward goals
          </Typography>

          {plan.total === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No goals set yet. Goals are added from a quarterly report and
              tracked from every report after it.
            </Typography>
          ) : (
            <>
              <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                <Stat label="Goals" value={plan.total} />
                <Stat label="Done" value={plan.done} />
                <Stat label="In progress" value={plan.active} />
                <Stat label="Needs attention" value={plan.needsAttention} />
                <Stat label="Behind schedule" value={plan.behindSchedule} />
              </Stack>

              <Typography variant="body2" gutterBottom>
                {plan.percentComplete}% complete overall
              </Typography>
              <LinearProgress
                variant="determinate"
                value={plan.percentComplete}
              />
            </>
          )}
        </CardContent>
      </Card>

      {plan.goals.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h4" paragraph>
              The plan
            </Typography>
            {plan.goals.map((goal) => (
              <GoalRow key={goal.id} goal={goal} />
            ))}
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

const GoalRow = ({ goal }: { goal: Goal }) => {
  const measurement = goal.measurement.value;
  const status = goal.status.value;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body1" sx={{ flex: 1 }}>
          {goal.goal.value}
        </Typography>
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
        {goal.scheduleStatus === 'Behind' && (
          <Chip size="small" label="Behind" color="error" />
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {measurement === 'Number' && goal.targetNumber.value
          ? `${goal.progressValue.value ?? 0} of ${goal.targetNumber.value}${
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
    </Box>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div>
    <Typography variant="h3">{value}</Typography>
    <Typography variant="overline" color="text.secondary">
      {label}
    </Typography>
  </div>
);
