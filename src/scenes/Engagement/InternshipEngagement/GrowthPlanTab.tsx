import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { RichTextView } from '../../../components/RichText';
import { type InternshipEngagementDetailFragment } from './InternshipEngagement.graphql';

/**
 * The growth plan at a glance: every goal this Global Translation Leader has
 * set, and how they are tracking against them.
 *
 * Goals belong to the quarter that set them, so this reads across every report
 * — the API does that rollup. Reviewed goals show met or unmet; the rest are
 * still open, which is deliberately not the same as failed.
 */
export const GrowthPlanTab = ({
  engagement,
}: {
  engagement: InternshipEngagementDetailFragment;
}) => {
  const plan = engagement.goalProgress;
  const reviewed = plan.met + plan.unmet;
  const pct = reviewed > 0 ? (plan.met / reviewed) * 100 : 0;

  return (
    <Stack spacing={3} sx={{ maxWidth: 760 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" paragraph>
            Progress toward goals
          </Typography>

          {plan.total === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No goals set yet. Goals are added on a quarterly report, and
              reviewed on the one after it.
            </Typography>
          ) : (
            <>
              <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                <Stat label="Goals set" value={plan.total} />
                <Stat label="Met" value={plan.met} />
                <Stat label="Not met" value={plan.unmet} />
                <Stat label="Awaiting review" value={plan.awaitingReview} />
              </Stack>

              {reviewed > 0 && (
                <>
                  <Typography variant="body2" gutterBottom>
                    {plan.met} of {reviewed} reviewed goals met —{' '}
                    {Math.round(pct)}%
                  </Typography>
                  <LinearProgress variant="determinate" value={pct} />
                </>
              )}
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
              <Box key={goal.id} sx={{ mb: 2.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {goal.goal.value}
                  </Typography>
                  <Chip
                    size="small"
                    label={
                      goal.met.value == null
                        ? 'Awaiting review'
                        : goal.met.value
                        ? 'Met'
                        : 'Not met'
                    }
                    color={
                      goal.met.value == null
                        ? 'default'
                        : goal.met.value
                        ? 'success'
                        : 'warning'
                    }
                  />
                </Stack>
                {goal.details.value && (
                  <RichTextView data={goal.details.value} />
                )}
                {goal.impact.value && <RichTextView data={goal.impact.value} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Stack>
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
