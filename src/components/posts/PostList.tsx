import { Add } from '@mui/icons-material';
import { Grid, Tooltip, Typography } from '@mui/material';
import { Except } from 'type-fest';
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
}

export const PostList = ({
  includeMembership = false,
  headless = false,
  parent,
  ContainerProps,
  ...rest
}: PostListProps) => {
  const [createPostState, createPost] = useDialog();
  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ maxWidth: 600 }}>
        {!headless && (
          <Grid item>
            <Typography variant="h3">Posts</Typography>
          </Grid>
        )}
        <Grid
          item
          sx={{
            display: 'flex',
            justifyContent: headless ? 'flex-end' : 'inherit',
            flex: 1,
          }}
        >
          <Tooltip title="Add Post">
            <Fab color="error" onClick={createPost} aria-label="Add post">
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
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
        includeMembership={includeMembership}
        parent={parent}
      />
    </div>
  );
};
