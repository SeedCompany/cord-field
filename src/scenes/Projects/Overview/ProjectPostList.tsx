import { useListQuery } from '../../../components/List';
import { PostableIdFragment } from '../../../components/posts/PostableId.graphql';
import { PostList } from '../../../components/posts/PostList';
import { ProjectPostListDocument as PostListQuery } from './ProjectPostList.graphql';

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
