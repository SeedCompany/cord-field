import { useQuery } from '@apollo/client';
import {
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { GtlPrayerStepListDocument as PrayerList } from '../EditForm/Steps/Prayer/PrayerStep.graphql';

/**
 * The prayer submitted with this report — read-only.
 *
 * Reads the engagement's posts and narrows to the ones carrying this report's
 * id, because the engagement is the Postable parent and the report is an
 * attribution on the post. The engagement's whole prayer stream, including
 * requests shared between reports, lives on its own Prayer tab.
 */
export const PrayerSummaryCard = ({
  reportId,
  engagementId,
}: {
  reportId: string;
  engagementId: string;
}) => {
  const { data, loading } = useQuery(PrayerList, {
    variables: { engagement: engagementId, input: { count: 25 } },
  });

  const engagement =
    data?.engagement.__typename === 'InternshipEngagement'
      ? data.engagement
      : undefined;
  const items = (engagement?.posts.items ?? []).filter(
    (p) => p.report.value?.id === reportId
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Prayer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Requests and praises shared with this quarter&rsquo;s report.
        </Typography>
        {loading ? (
          <>
            <Skeleton width="80%" />
            <Skeleton width="60%" />
          </>
        ) : items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nothing added yet.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {items.map((post) => (
              <Stack
                key={post.id}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {post.body.value}
                </Typography>
                <Chip
                  label={post.effectiveShareability}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
