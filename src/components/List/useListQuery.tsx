import { useQuery } from '@apollo/client';
import { NetworkStatus } from '@apollo/client/core';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useState } from 'react';
import {
  PaginatedListInput,
  PaginatedListOutput,
} from '../../api/typePolicies/lists/page-limit-pagination';

export interface ListQueryResult<Item> {
  loading: boolean;
  data?: PaginatedListOutput<Item>;
  loadMore: () => void;
  networkStatus: NetworkStatus;
}

export const useListQuery = <Item, Args extends PaginatedListInput>(
  doc: TypedDocumentNode<
    Record<string, PaginatedListOutput<Item>>,
    { input?: Args | null }
  >,
  args?: Args
): ListQueryResult<Item> => {
  const { loading, data: res, fetchMore, networkStatus } = useQuery(doc, {
    variables: { input: args },
    notifyOnNetworkStatusChange: true,
  });
  // Assume there's only one query in this document/operation
  const data = res?.[Object.keys(res)[0]!];

  const [page, setPage] = useState(1);
  const loadMore = () => {
    void fetchMore({
      variables: {
        input: {
          ...args,
          page: page + 1,
        },
      },
    }).then(() => {
      setPage(page + 1);
    });
  };

  return { loading, data, loadMore, networkStatus };
};
