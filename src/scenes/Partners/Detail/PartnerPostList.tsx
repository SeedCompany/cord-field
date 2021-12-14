import * as React from 'react';
import { useListQuery } from '../../../components/List';
import { PostableIdFragment } from '../../../components/posts/PostableId.generated';
import { PostList } from '../../../components/posts/PostList';
import { PartnerPostListDocument as PostListQuery } from './PartnerPostList.generated';

interface PartnerPostListProps {
  partner: PostableIdFragment;
}

export const PartnerPostList = ({ partner }: PartnerPostListProps) => {
  const posts = useListQuery(PostListQuery, {
    listAt: (data) => data.partner.posts,
    variables: {
      partner: partner.id,
    },
  });

  return <PostList parent={partner} {...posts} />;
};
