import { useListQuery } from '~/components/List';
import { PostableIdFragment } from '~/components/posts/PostableId.graphql';
import { PostList } from '~/components/posts/PostList';
import { LanguagePostListDocument as LanguagePosts } from '../../LanguagePostList.graphql';

interface LanguageDetailPostsProps {
  language: PostableIdFragment;
}

export const LanguageDetailPosts = ({ language }: LanguageDetailPostsProps) => {
  const posts = useListQuery(LanguagePosts, {
    listAt: (data) => data.language.posts,
    variables: {
      language: language.id,
    },
  });

  return <PostList parent={language} headless {...posts} />;
};
