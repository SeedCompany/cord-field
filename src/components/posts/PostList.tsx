import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import * as React from 'react';
import { Except } from 'type-fest';
import { useDialog } from '../Dialog';
import { Fab } from '../Fab';
import { List, ListProps } from '../List';
import { CreatePost } from './CreatePost';
import { PostableIdFragment } from './PostableId.graphql';
import { PostListItemCard } from './PostListItemCard';
import { PostListItemCardFragment } from './PostListItemCard/PostListItemCard.graphql';

const useStyles = makeStyles(() => ({
  postListItems: {
    maxWidth: 600,
  },
}));

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
  const classes = useStyles();
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
        classes={{ container: classes.postListItems }}
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
