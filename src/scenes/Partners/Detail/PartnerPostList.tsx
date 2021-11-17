import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { List, useListQuery } from '../../../components/List';
import { CreatePost } from '../../../components/posts/CreatePost';
import { PostListItemCard } from '../../../components/posts/PostListItemCard';
import {
  PartnerQuery,
  PartnerPostListOverviewDocument as PostList,
} from './PartnerDetail.generated';

interface PartnerPostListProps {
  partner: PartnerQuery['partner'];
}

const useStyles = makeStyles(({ spacing }) => ({
  postList: {
    marginTop: spacing(-3),
  },
  postListItems: {
    maxWidth: 600,
  },
}));

export const PartnerPostList: FC<PartnerPostListProps> = ({ partner }) => {
  const classes = useStyles();

  const [createPostState, createPost] = useDialog();

  const posts = useListQuery(PostList, {
    listAt: (data) => data.partner.posts,
    variables: {
      partner: partner.id,
    },
  });

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
        classes={{
          container: classes.postListItems,
        }}
        spacing={3}
        renderItem={(post) => (
          <PostListItemCard parent={partner as any} post={post} />
        )}
        skeletonCount={0}
        renderSkeleton={null}
      />
      <CreatePost {...createPostState} parent={partner as any} />
    </div>
  );
};
