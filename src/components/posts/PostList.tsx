import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { useDialog } from '../Dialog';
import { Fab } from '../Fab';
import { List } from '../List';
import { CreatePost } from './CreatePost';
import { PostableIdFragment } from './PostableId.generated';
import { PostListItemCard } from './PostListItemCard';
import { PostListItemCardFragment } from './PostListItemCard/PostListItemCard.generated';

const useStyles = makeStyles(() => ({
  postListItems: {
    maxWidth: 600,
  },
}));

interface PostListProps {
  parent: PostableIdFragment;
  posts: any;
  includeMembership?: boolean;
}

export const PostList: FC<PostListProps> = ({
  posts,
  includeMembership = false,
  parent,
}) => {
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
        {...posts}
        classes={{ container: classes.postListItems }}
        spacing={3}
        renderItem={(post) => (
          <PostListItemCard
            includeMembership={includeMembership}
            parent={parent}
            post={post as PostListItemCardFragment}
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
