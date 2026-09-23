import { useMutation, useQuery } from '@apollo/client';
import { Add, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { type ReactNode } from 'react';
import { canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import { CreatePost } from '~/components/posts/CreatePost';
import { EditPost } from '~/components/posts/EditPost';
import { PostProvenance } from '~/components/posts/PostProvenance';
import { IconButton } from '../../../../../components/IconButton';
import { type GtlStepProps } from '../../stepTypes';
import {
  AttachGtlPrayerToReportDocument as AttachToReport,
  type GtlPrayerStepListQuery,
  GtlPrayerStepListDocument as PrayerList,
} from './PrayerStep.graphql';

type PrayerPost = Extract<
  GtlPrayerStepListQuery['engagement'],
  { __typename: 'InternshipEngagement' }
>['posts']['items'][number];

/**
 * Prayer requests and updates, captured as part of submitting this report.
 *
 * Identical in shape to Momentum's Prayer step, and deliberately so — the
 * engagement is the Postable parent, composing here creates the post on the
 * engagement with this report's id attached, and attaching an existing request
 * only sets that reference. Nothing is copied, and detaching later leaves the
 * request on the engagement rather than deleting it, which is the whole reason
 * the report is an attribution rather than the parent.
 */
export const PrayerStep = ({ report }: GtlStepProps) => {
  const engagementId = report.parent.id;
  const { data, loading } = useQuery(PrayerList, {
    variables: { engagement: engagementId, input: { count: 25 } },
  });
  const [attachToReport] = useMutation(AttachToReport);
  const [composeState, compose] = useDialog();

  const engagement =
    data?.engagement.__typename === 'InternshipEngagement'
      ? data.engagement
      : undefined;
  const items = engagement?.posts.items ?? [];
  const inThisReport = items.filter((p) => p.report.value?.id === report.id);
  const recentUnattached = items.filter((p) => !p.report.value).slice(0, 5);

  // `updatePost` requires the unchanged fields alongside the one being set, so
  // both directions pass the post's current values and differ only in `report`.
  const setReport = (post: PrayerPost, reportId: string | null) =>
    attachToReport({
      variables: {
        input: {
          id: post.id,
          type: post.type,
          shareability: post.shareability,
          body: post.body.value ?? '',
          report: reportId,
        },
      },
    });

  return (
    <Box sx={{ maxWidth: 'md', mb: 4 }}>
      <Typography variant="h3" paragraph>
        Prayer
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        What are you thankful for, and what needs can we join you in praying
        for? These also appear on the engagement&rsquo;s Prayer tab right away,
        and stay there even if this report changes later.
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
                <Button size="small" onClick={() => void setReport(post, null)}>
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
                    onClick={() => void setReport(post, report.id)}
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

/**
 * One prayer request or update. The card is a status glance; editing any of it
 * — wording, translation, clearance — happens in the shared Edit dialog behind
 * the pencil, so each of those decisions has exactly one place it gets made
 * regardless of which list the request is showing in.
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
