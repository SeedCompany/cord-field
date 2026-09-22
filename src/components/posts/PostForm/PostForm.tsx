import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { without } from 'lodash';
import { useState } from 'react';
import {
  PostShareability,
  PostShareabilityLabels,
  PostShareabilityList,
  PostTypeList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  SecuredField,
  SelectField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { minLength, required } from '../../form/validators';
import { useSession } from '../../Session';
import {
  ModeratePostReachDocument,
  PostFormFragment,
  TogglePostFeaturedDocument,
  UpdatePostFinalWordingDocument,
} from './PostForm.graphql';

export type PostFormProps<T, R = void> = DialogFormProps<T, R> & {
  /** The pre-existing post to edit */
  post?: PostFormFragment;
  includeMembership?: boolean;
};

const shareabilityList = (includeMembership: boolean) =>
  without<PostShareability>(
    PostShareabilityList,
    ...(includeMembership ? [] : ['Membership' as const])
  );

// Rank narrowest to widest — mirrors `reachRank` in shareability.dto.ts on the
// API. Kept local rather than fetched: it only decides which options
// ClearedControl offers, and duplicating five stable enum ranks here is
// cheaper than a schema round-trip to fetch them.
const shareabilityRank: Record<PostShareability, number> = {
  Membership: 0,
  ProjectTeam: 0,
  Internal: 1,
  AskToShareExternally: 2,
  External: 3,
};

export const PostForm = <T, R = void>({
  post,
  includeMembership = false,
  ...rest
}: PostFormProps<T, R>) => {
  const { session } = useSession();
  // A brand new post has no author yet — it's whoever is creating it. An
  // existing one may be open here for a reason other than authorship: a
  // moderator can edit `body` (see ModeratePostsPolicy on the API) without
  // being able to change what was requested, so those two fields stay
  // author-only rather than trusting a disabled-vs-enabled render to guess it.
  const isAuthor = !post || post.creator.value?.id === session?.id;

  return (
    <DialogForm<T, R>
      DialogProps={{
        maxWidth: 'sm',
      }}
      {...rest}
    >
      <SubmitError />
      {isAuthor && (
        <Grid container spacing={2}>
          <Grid item xs>
            <SelectField
              label="Category"
              name="type"
              options={PostTypeList}
              variant="outlined"
              defaultValue="Note"
            />
          </Grid>
          <Grid item xs>
            <SelectField
              label="Shareability"
              name="shareability"
              options={shareabilityList(includeMembership)}
              variant="outlined"
              getOptionLabel={labelFrom(PostShareabilityLabels)}
              defaultValue="Internal"
            />
          </Grid>
        </Grid>
      )}
      <SecuredField obj={post} name="body">
        {(props) => (
          <TextField
            variant="outlined"
            multiline
            placeholder="Say something..."
            minRows={4}
            validate={[required, minLength()]}
            {...props}
          />
        )}
      </SecuredField>
      {post &&
        (post.approvedShareability.canEdit ||
          post.approvedShareability.value) && <ClearedControl post={post} />}
      {post && (post.finalBody.canEdit || post.finalBody.value) && (
        <FinalWordingControl post={post} />
      )}
      {post?.report.value && (post.featured.canEdit || post.featured.value) && (
        <FeaturedControl post={post} />
      )}
    </DialogForm>
  );
};

/**
 * How widely a post is cleared to reach vs. what was requested — a separate
 * decision from editing content, made by a moderator rather than the author.
 * Read-only for anyone who can see the clearance but not set it, so it's
 * never hidden behind a permission a reader lacks.
 */
const ClearedControl = ({ post }: { post: PostFormFragment }) => {
  const [moderate, { loading, error }] = useMutation(ModeratePostReachDocument);
  const [selected, setSelected] = useState<PostShareability>(
    post.approvedShareability.value ?? post.shareability
  );

  if (!post.approvedShareability.canEdit) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Requested: {PostShareabilityLabels[post.shareability]} · Cleared:{' '}
          {post.approvedShareability.value
            ? PostShareabilityLabels[post.approvedShareability.value]
            : 'Not yet reviewed'}
        </Typography>
      </Box>
    );
  }

  const options = PostShareabilityList.filter(
    (v) => shareabilityRank[v] <= shareabilityRank[post.shareability]
  );
  const dirty = selected !== post.approvedShareability.value;

  return (
    <Stack spacing={1} sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary">
        Requested: {PostShareabilityLabels[post.shareability]} · Cleared:{' '}
        {post.approvedShareability.value
          ? PostShareabilityLabels[post.approvedShareability.value]
          : 'Not yet reviewed'}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Select
          size="small"
          value={selected}
          onChange={(e) => setSelected(e.target.value as PostShareability)}
          sx={{ flex: 1 }}
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
      {error && <SubmitError>{error.message}</SubmitError>}
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
const FinalWordingControl = ({ post }: { post: PostFormFragment }) => {
  const [update, { loading, error }] = useMutation(
    UpdatePostFinalWordingDocument
  );
  const [value, setValue] = useState(
    post.finalBody.value ?? post.body.value ?? ''
  );

  if (!post.finalBody.canEdit) {
    return (
      <Box sx={{ mt: 2 }}>
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
    <Stack spacing={1} sx={{ mt: 2 }}>
      <Typography variant="caption" color="text.secondary">
        Final wording
        {!post.finalBody.value && ' — not yet set; starts from the original'}
      </Typography>
      <MuiTextField
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
      {error && <SubmitError>{error.message}</SubmitError>}
    </Stack>
  );
};

/**
 * Whether this post is curated into its report's Investor Report — a
 * decision distinct from shareability (may it leave Seed Company at all).
 * Only relevant once attached to a report (see the `post.report.value` guard
 * at the call site). A switch rather than a clickable chip/badge: a badge
 * that happens to also be a button reads as a status label, not a control —
 * the switch makes "this is a toggle you can flip" unambiguous.
 */
const FeaturedControl = ({ post }: { post: PostFormFragment }) => {
  const [update, { loading, error }] = useMutation(TogglePostFeaturedDocument);

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
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={post.featured.value ?? false}
            disabled={!post.featured.canEdit || loading}
            onChange={() => void toggle()}
          />
        }
        label="Publish to Investor Report"
      />
      {error && <SubmitError>{error.message}</SubmitError>}
    </Box>
  );
};
