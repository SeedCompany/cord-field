import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { addItemToList } from '../../../api';
import { Fab } from '../../../components/Fab';
import { List, useListQuery } from '../../../components/List';
import { CreatePostForm } from '../../../components/posts/CreatePostForm';
import { PostListItemCard } from '../../../components/posts/PostListItemCard';
import {
  ProjectPostListOverviewDocument as PostList,
  ProjectOverviewQuery,
} from './ProjectOverview.generated';

interface ProjectPostListProps {
  project: ProjectOverviewQuery['project'];
}

const useStyles = makeStyles(({ spacing }) => ({
  postList: {
    marginTop: spacing(-3),
  },
  postListItems: {
    maxWidth: 600,
  },
}));

export const ProjectPostList: FC<ProjectPostListProps> = ({ project }) => {
  const classes = useStyles();
  const [showCommentField, setShowCommentField] = React.useState(false);
  const toggleCommentField = () => setShowCommentField(!showCommentField);

  const posts = useListQuery(PostList, {
    listAt: (data) => data.project.posts,
    variables: {
      project: project.id,
    },
  });

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h3">Comments</Typography>
        </Grid>
        <Grid item>
          <Tooltip title={`Add Comment`}>
            <Fab
              color="error"
              aria-label={`Add Comment`}
              onClick={toggleCommentField}
            >
              <Add />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
      {showCommentField && (
        <CreatePostForm
          parentId={project.id}
          mutationUpdate={addItemToList({
            listId: [project, 'posts'],
            outputToItem: (data) => data.createPost.post,
          })}
          onSubmit={() => {
            toggleCommentField();
          }}
        />
      )}
      <List
        {...posts}
        classes={{
          container: classes.postListItems,
        }}
        spacing={3}
        renderItem={(post) => <PostListItemCard {...post} />}
        skeletonCount={0}
        renderSkeleton={null}
      />
    </>
  );
};
