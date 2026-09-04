import { useMutation, useQuery } from '@apollo/client';
import { Add, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import { CreatePost } from '~/components/posts/CreatePost';
import { EditPost } from '~/components/posts/EditPost';
import { PostProvenance } from '~/components/posts/PostProvenance';
import { StepComponent } from '../step.types';
import {
  AttachPrayerToReportDocument as AttachToReport,
  PrayerStepListDocument as PrayerList,
  PrayerStepListQuery,
} from './PrayerStep.graphql';

type PrayerPost = Extract<
  PrayerStepListQuery['engagement'],
  { __typename: 'LanguageEngagement' }
>['posts']['items'][number];

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
 *
 * Each card shows status at a glance (requested reach, provenance, whether
 * it's going to investors); editing any of that — content, translation,
 * clearance, or the Investor Report toggle — happens in the Edit dialog
 * (PostForm), the same one used everywhere else a post appears, so a request
 * manages the same way here as on the engagement's own Prayer tab.
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
            <PrayerCard
              key={post.id}
              post={post}
              action={
                <Button size="small" onClick={() => void detach(post.id, post)}>
                  Remove
                </Button>
              }
            />
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
              <PrayerCard
                key={post.id}
                post={post}
                action={
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => void attach(post.id, post)}
                  >
                    Include
                  </Button>
                }
              />
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

/**
 * One prayer request or update. The card itself is a status glance — wording,
 * requested reach, provenance, and whether it's going to investors; editing
 * any of that (content, translation, clearance, the Investor Report toggle)
 * happens in the Edit dialog behind the pencil, not here, so there's exactly
 * one place each of those decisions gets made regardless of which list a
 * request happens to be showing in.
 */
const PrayerCard = ({
  post,
  action,
}: {
  post: PrayerPost;
  action: ReactNode;
}) => {
  const [editState, editPost] = useDialog();

  return (
    <Card variant="outlined" elevation={0}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Typography variant="body2" sx={{ flex: 1 }}>
            {post.body.value}
          </Typography>
          <PostProvenance post={post} />
          {post.featured.value && (
            <Chip
              label="Published to Investor Report"
              color="primary"
              size="small"
            />
          )}
          <Chip
            label={post.effectiveShareability}
            size="small"
            variant="outlined"
          />
          {canEditAny(post) && (
            <IconButton size="small" onClick={() => editPost()}>
              <Edit fontSize="small" />
            </IconButton>
          )}
          {action}
        </Box>
      </CardContent>
      <EditPost post={post} includeMembership={false} {...editState} />
    </Card>
  );
};
