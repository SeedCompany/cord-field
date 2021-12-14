import * as React from 'react';
import { useListQuery } from '../../../components/List';
import { PostableIdFragment } from '../../../components/posts/PostableId.generated';
import { PostList } from '../../../components/posts/PostList';
import { ProjectPostListDocument as PostListQuery } from './ProjectPostList.generated';

interface ProjectPostListProps {
  project: PostableIdFragment;
}

export const ProjectPostList = ({ project }: ProjectPostListProps) => {
  const posts = useListQuery(PostListQuery, {
    listAt: (data) => data.project.posts,
    variables: {
      project: project.id,
    },
  });

  return <PostList parent={project} {...posts} includeMembership />;
};
