import { useQuery } from '@apollo/client';
import { NetworkStatus } from '@apollo/client/core';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useState } from 'react';
import {
  PaginatedListInput,
  PaginatedListOutput,
} from '../../api/typePolicies/lists/page-limit-pagination';

export interface ListQueryResult<
  Item,
  List extends PaginatedListOutput<Item>,
  Data
> {
  loading: boolean;
  data?: List;
  // The root object of the query result.
  root?: Data;
  loadMore: () => void;
  networkStatus: NetworkStatus;
}

export const useListQuery = <
  Data,
  Variables extends { input?: PaginatedListInput | null },
  Item,
  List extends PaginatedListOutput<Item>
>(
  doc: TypedDocumentNode<Data, Variables>,
  options: QueryHookOptions<Data, Variables> & {
    listAt: (data: Data) => List;
  }
): ListQueryResult<Item, List, Data> => {
  const { listAt, ...opts } = options;
  const { loading, data: res, fetchMore, networkStatus } = useQuery(doc, {
    ...opts,
    notifyOnNetworkStatusChange: true,
  });
  const data = res ? listAt(res) : undefined;

  const [page, setPage] = useState(1);
  const loadMore = () => {
    void fetchMore({
      variables: {
        ...options.variables,
        input: {
          ...options.variables?.input,
          page: page + 1,
        },
      },
    }).then(() => {
      setPage(page + 1);
    });
  };

  return { loading, data, loadMore, networkStatus, root: res };
};
