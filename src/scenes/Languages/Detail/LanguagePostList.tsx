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
  LanguageQuery,
  LanguagePostListOverviewDocument as PostList,
} from './LanguageDetail.generated';

interface LanguagePostListProps {
  language: LanguageQuery['language'];
}

const useStyles = makeStyles(({ spacing }) => ({
  postList: {
    marginTop: spacing(1),
    marginLeft: spacing(1.5),
    maxWidth: 500,
  },
  postListItems: {
    maxWidth: 600,
  },
}));

export const LanguagePostList: FC<LanguagePostListProps> = ({ language }) => {
  const classes = useStyles();

  const [createPostState, createPost] = useDialog();

  const posts = useListQuery(PostList, {
    listAt: (data) => data.language.posts,
    variables: {
      language: language.id,
    },
  });

  return (
    <div className={classes.postList}>
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
          <PostListItemCard parent={language} post={post} />
        )}
        renderSkeleton={null}
        skeletonCount={0}
      />
      <CreatePost {...createPostState} parent={language} />
    </div>
  );
};
