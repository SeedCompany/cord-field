import { useMutation, useQuery } from '@apollo/client';
import { Add, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import {
  PostShareability,
  PostShareabilityLabels,
  PostShareabilityList,
} from '~/api/schema.graphql';
import { useDialog } from '~/components/Dialog';
import { CreatePost } from '~/components/posts/CreatePost';
import { EditPost } from '~/components/posts/EditPost';
import { PostProvenance } from '~/components/posts/PostProvenance';
import { StepComponent } from '../step.types';
import {
  AttachPrayerToReportDocument as AttachToReport,
  ModeratePrayerRequestDocument as ModeratePrayerRequest,
  PrayerStepListDocument as PrayerList,
  PrayerStepListQuery,
  ToggleFeaturedForInvestorReportDocument as ToggleFeatured,
  UpdatePrayerFinalWordingDocument as UpdateFinalWording,
} from './PrayerStep.graphql';

type PrayerPost = Extract<
  PrayerStepListQuery['engagement'],
  { __typename: 'LanguageEngagement' }
>['posts']['items'][number];

// Rank narrowest to widest — mirrors `reachRank` in shareability.dto.ts on the
// API. Kept local rather than fetched: it only decides which options this one
// control offers, and duplicating five stable enum ranks here is cheaper than
// a schema round-trip to fetch them.
const shareabilityRank: Record<PostShareability, number> = {
  Membership: 0,
  ProjectTeam: 0,
  Internal: 1,
  AskToShareExternally: 2,
  External: 3,
};

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
 * One prayer request or update, with four independent controls: the original
 * content (the author only — see `PostForm`/UserCanManageOwnCommentsPolicy),
 * the finalized wording shown externally (a translator or moderator — see
 * FinalizePostWordingPolicy), the shareability clearance (a moderator only),
 * and — only once attached to a report — whether it's curated into that
 * report's Investor Report (see FeaturePostForInvestorReportPolicy). Four
 * separate controls because they're four separate decisions: none of editing,
 * translating, clearing reach, or featuring implies any of the others.
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
          {post.body.canEdit && (
            <IconButton size="small" onClick={() => editPost()}>
              <Edit fontSize="small" />
            </IconButton>
          )}
          {action}
        </Box>
        {post.approvedShareability.canEdit && <ApprovalControl post={post} />}
        {(post.finalBody.canEdit || post.finalBody.value) && (
          <FinalWordingControl post={post} />
        )}
        {!!post.report.value && <FeaturedControl post={post} />}
      </CardContent>
      <EditPost post={post} includeMembership={false} {...editState} />
    </Card>
  );
};

const ApprovalControl = ({ post }: { post: PrayerPost }) => {
  const [moderate, { loading }] = useMutation(ModeratePrayerRequest);
  const [selected, setSelected] = useState<PostShareability>(
    post.approvedShareability.value ?? post.shareability
  );

  const options = PostShareabilityList.filter(
    (v) => shareabilityRank[v] <= shareabilityRank[post.shareability]
  );
  const dirty = selected !== post.approvedShareability.value;

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}
    >
      <Typography variant="caption" color="text.secondary">
        Requested: {PostShareabilityLabels[post.shareability]} · Cleared:{' '}
        {post.approvedShareability.value
          ? PostShareabilityLabels[post.approvedShareability.value]
          : 'Not yet reviewed'}
      </Typography>
      <Box sx={{ flex: 1 }} />
      <Select
        size="small"
        value={selected}
        onChange={(e) => setSelected(e.target.value as PostShareability)}
      >
        {options.map((value) => (
          <MenuItem key={value} value={value}>
            {PostShareabilityLabels[value]}
          </MenuItem>
        ))}
      </Select>
      <Button
        size="small"
        variant={dirty ? 'contained' : 'outlined'}
        disabled={!dirty || loading}
        onClick={() =>
          void moderate({
            variables: { input: { id: post.id, shareability: selected } },
          })
        }
      >
        {post.approvedShareability.value ? 'Update' : 'Approve'}
      </Button>
    </Stack>
  );
};

/**
 * The wording actually shown once this leaves the author's hands — a
 * translation, a moderator's touch-up, or both (see `Post.finalBody` on the
 * API). Starts from a copy of the original as an editable starting point
 * rather than blank, since a translator's job is rendering that text, not
 * writing new text. Read-only for anyone who can see it but not edit it, so
 * the finalized wording is never hidden behind a permission a reader lacks.
 */
const FinalWordingControl = ({ post }: { post: PrayerPost }) => {
  const [update, { loading }] = useMutation(UpdateFinalWording);
  const [value, setValue] = useState(
    post.finalBody.value ?? post.body.value ?? ''
  );

  if (!post.finalBody.canEdit) {
    return (
      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Final wording
        </Typography>
        <Typography variant="body2">{post.finalBody.value}</Typography>
      </Box>
    );
  }

  const dirty = value !== (post.finalBody.value ?? '');

  const save = () =>
    update({
      variables: {
        input: {
          id: post.id,
          type: post.type,
          shareability: post.shareability,
          body: post.body.value ?? '',
          finalBody: value || null,
        },
      },
    });

  return (
    <Stack
      spacing={1}
      sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}
    >
      <Typography variant="caption" color="text.secondary">
        Final wording
        {!post.finalBody.value && ' — not yet set; starts from the original'}
      </Typography>
      <TextField
        size="small"
        multiline
        minRows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          variant={dirty ? 'contained' : 'outlined'}
          disabled={!dirty || loading}
          onClick={() => void save()}
        >
          Save
        </Button>
      </Box>
    </Stack>
  );
};

/**
 * Whether this request is curated into this report's Investor Report — a
 * distinct decision from shareability (may it leave Seed Company at all).
 * Only rendered once a request is attached to a report (see the `report.value`
 * guard at the call site): a request between reports isn't part of any
 * specific investor-facing document to feature it in. The API also enforces
 * this, plus a minimum clearance, independent of what this button shows.
 */
const FeaturedControl = ({ post }: { post: PrayerPost }) => {
  const [update, { loading }] = useMutation(ToggleFeatured);

  if (!post.featured.canEdit && !post.featured.value) {
    return null;
  }

  const toggle = () =>
    update({
      variables: {
        input: {
          id: post.id,
          type: post.type,
          shareability: post.shareability,
          body: post.body.value ?? '',
          featured: !post.featured.value,
        },
      },
    });

  return (
    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
      <Chip
        label={
          post.featured.value
            ? 'Published to Investor Report'
            : 'Not in Investor Report'
        }
        color={post.featured.value ? 'primary' : 'default'}
        variant={post.featured.value ? 'filled' : 'outlined'}
        size="small"
        disabled={loading}
        onClick={post.featured.canEdit ? () => void toggle() : undefined}
      />
    </Box>
  );
};
