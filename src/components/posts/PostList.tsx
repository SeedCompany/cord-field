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
}

export const PostList = ({
  includeMembership = false,
  parent,
  ...rest
}: PostListProps) => {
  const [createPostState, createPost] = useDialog();

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h3">Posts</Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Add Post">
            <Fab color="error" onClick={createPost}>
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
      <List
        {...rest}
        ContainerProps={{
          ...rest.ContainerProps,
          sx: [{ maxWidth: 600 }, ...extendSx(rest.ContainerProps?.sx)],
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
