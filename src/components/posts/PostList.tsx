import { Add } from '@mui/icons-material';
import { Grid, Tooltip, Typography } from '@mui/material';
import { Except } from 'type-fest';
import { PostType } from '~/api/schema.graphql';
import { extendSx } from '~/common';
import { useDialog } from '../Dialog';
import { Fab } from '../Fab';
import { List, ListProps } from '../List';
import { CreatePost } from './CreatePost';
import { PostableIdFragment } from './PostableId.graphql';
import { PostListItemCard } from './PostListItemCard';
import { PostListItemCardFragment } from './PostListItemCard/PostListItemCard.graphql';

interface PostListProps
  extends Except<
    ListProps<PostListItemCardFragment>,
    'renderItem' | 'renderSkeleton'
  > {
  parent: PostableIdFragment;
  includeMembership?: boolean;
  headless?: boolean; // hides title and right-aligns the add button, used when rendered inside a tab
  /** Lock the list to one category. @see PostForm */
  fixedType?: PostType;
  /** The parent field this list came from, when it isn't `posts`. */
  listField?: 'posts' | 'prayerRequests';
  /** Defaults to "Posts". */
  title?: string;
  /** Drop the add button — the read-only view of a report. */
  readOnly?: boolean;
}

export const PostList = ({
  includeMembership = false,
  headless = false,
  parent,
  fixedType,
  listField,
  title = 'Posts',
  readOnly = false,
  ContainerProps,
  ...rest
}: PostListProps) => {
  const [createPostState, createPost] = useDialog();
  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ maxWidth: 600 }}>
        {!headless && (
          <Grid item>
            <Typography variant="h3">{title}</Typography>
          </Grid>
        )}
        {!readOnly && (
          <Grid
            item
            sx={{
              display: 'flex',
              justifyContent: headless ? 'flex-end' : 'inherit',
              flex: 1,
            }}
          >
            <Tooltip title={`Add ${fixedType ?? 'Post'}`}>
              <Fab color="error" onClick={createPost} aria-label="Add post">
                <Add />
              </Fab>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <List
        {...rest}
        ContainerProps={{
          ...ContainerProps,
          sx: [{ maxWidth: 600 }, ...extendSx(ContainerProps?.sx)],
        }}
        spacing={3}
        renderItem={(post) => (
          <PostListItemCard
            includeMembership={includeMembership}
            parent={parent}
            post={post}
          />
        )}
        skeletonCount={0}
        renderSkeleton={null}
      />
      <CreatePost
        {...createPostState}
        open={createPostState.open && !readOnly}
        title={fixedType ? `Add ${fixedType}` : 'Add Post'}
        fixedType={fixedType}
        listField={listField}
        includeMembership={includeMembership}
        parent={parent}
      />
    </div>
  );
};
