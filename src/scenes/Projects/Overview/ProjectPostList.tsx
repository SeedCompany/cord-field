import { FC } from 'react';
import * as React from 'react';
import { useListQuery } from '../../../components/List';
import { PostList } from '../../../components/posts/PostList';
import {
  ProjectPostListOverviewDocument as PostListQuery,
  ProjectOverviewQuery,
} from './ProjectOverview.generated';

interface ProjectPostListProps {
  project: ProjectOverviewQuery['project'];
}

export const ProjectPostList: FC<ProjectPostListProps> = ({ project }) => {
  const posts = useListQuery(PostListQuery, {
    listAt: (data) => data.project.posts,
    variables: {
      project: project.id,
    },
  });

  return <PostList parent={project} posts={posts} includeMembership></PostList>;
};
