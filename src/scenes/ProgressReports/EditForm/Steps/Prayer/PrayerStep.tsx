import { useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { useDialog } from '~/components/Dialog';
import { CreatePost } from '~/components/posts/CreatePost';
import { StepComponent } from '../step.types';
import {
  AttachPrayerToReportDocument as AttachToReport,
  PrayerStepListDocument as PrayerList,
} from './PrayerStep.graphql';

/**
 * Prayer requests and updates, captured as part of submitting this report.
 *
 * New requests are the primary action here — a partner writing up the quarter
 * is exactly who is positioned to say what to pray for. Underneath, composing
 * here creates the post directly on the engagement (that is the Postable
 * parent) with this report's id attached, so it also shows up in the
 * engagement's own Prayer tab immediately.
 *
 * Secondary to that: recent requests shared on the engagement since the last
 * report can be pulled in too, without retyping them. Attaching only sets the
 * report reference — nothing is copied or duplicated, and detaching later
 * leaves the request on the engagement rather than deleting it.
 */
export const PrayerStep: StepComponent = ({ report }) => {
  const engagementId = report.parent.id;
  const { data, loading } = useQuery(PrayerList, {
    variables: {
      engagement: engagementId,
      input: { count: 25 },
    },
  });
  const [attachToReport] = useMutation(AttachToReport);

  const [composeState, compose] = useDialog();

  const engagement =
    data?.engagement.__typename === 'LanguageEngagement'
      ? data.engagement
      : undefined;
  const items = engagement?.posts.items ?? [];
  const inThisReport = items.filter((p) => p.report.value?.id === report.id);
  const recentUnattached = items.filter((p) => !p.report.value).slice(0, 5);

  const attach = (id: string, current: (typeof items)[number]) =>
    attachToReport({
      variables: {
        input: {
          id,
          type: current.type,
          shareability: current.shareability,
          body: current.body.value ?? '',
          report: report.id,
        },
      },
    });

  const detach = (id: string, current: (typeof items)[number]) =>
    attachToReport({
      variables: {
        input: {
          id,
          type: current.type,
          shareability: current.shareability,
          body: current.body.value ?? '',
          report: null,
        },
      },
    });

  return (
    <Box sx={{ maxWidth: 'md', mb: 4 }}>
      <Typography variant="h3" paragraph>
        Prayer
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Share prayer requests and updates for this quarter. These also appear on
        the engagement's Prayer tab right away, and stay there even if this
        report changes later.
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => compose()}
        disabled={!engagement?.posts.canCreate}
        sx={{ mb: 3 }}
      >
        Add Prayer Request
      </Button>
      {engagement && (
        <CreatePost
          {...composeState}
          parent={engagement}
          report={report.id}
          initialValues={{ type: 'Prayer', shareability: 'Internal' }}
        />
      )}

      <Typography variant="subtitle1" gutterBottom>
        In this report {inThisReport.length > 0 && `(${inThisReport.length})`}
      </Typography>
      {inThisReport.length === 0 ? (
        <Typography variant="body2" color="text.secondary" paragraph>
          {loading ? 'Loading…' : 'Nothing added yet.'}
        </Typography>
      ) : (
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {inThisReport.map((post) => (
            <Card key={post.id} variant="outlined" elevation={0}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  '&:last-child': { pb: 2 },
                }}
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {post.body.value}
                </Typography>
                <Chip
                  label={post.effectiveShareability}
                  size="small"
                  variant="outlined"
                />
                <Button size="small" onClick={() => void detach(post.id, post)}>
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {recentUnattached.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Recent requests you can include
          </Typography>
          <Stack spacing={1.5}>
            {recentUnattached.map((post) => (
              <Card key={post.id} variant="outlined" elevation={0}>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    '&:last-child': { pb: 2 },
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {post.body.value}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => void attach(post.id, post)}
                  >
                    Include
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

PrayerStep.enableWhen = ({ report }) => !!report.parent.id;

// 'suggested' — not every quarter has a new prayer need, and requiring one
// here would just make someone invent a request to clear the gate.
PrayerStep.isIncomplete = () => ({
  isIncomplete: false,
  severity: 'suggested',
});
