import * as React from 'react';
import { useListQuery } from '../../../components/List';
import { PostableIdFragment } from '../../../components/posts/PostableId.graphql';
import { PostList } from '../../../components/posts/PostList';
import { LanguagePostListDocument as LanguagePosts } from './LanguagePostList.graphql';

interface LanguagePostListProps {
  language: PostableIdFragment;
}

export const LanguagePostList = ({ language }: LanguagePostListProps) => {
  const posts = useListQuery(LanguagePosts, {
    listAt: (data) => data.language.posts,
    variables: {
      language: language.id,
    },
  });

  return <PostList parent={language} {...posts} />;
};
