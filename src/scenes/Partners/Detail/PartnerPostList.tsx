import { FC } from 'react';
import * as React from 'react';
import { useListQuery } from '../../../components/List';
import { PostableId_Partner_Fragment } from '../../../components/posts/PostableId.generated';
import { PostList } from '../../../components/posts/PostList';
import {
  PartnerQuery,
  PartnerPostListOverviewDocument as PostListQuery,
} from './PartnerDetail.generated';

interface PartnerPostListProps {
  partner: PartnerQuery['partner'];
}

export const PartnerPostList: FC<PartnerPostListProps> = ({ partner }) => {
  const posts = useListQuery(PostListQuery, {
    listAt: (data) => data.partner.posts,
    variables: {
      partner: partner.id,
    },
  });

  return (
    <PostList parent={partner as PostableId_Partner_Fragment} posts={posts} />
  );
};
