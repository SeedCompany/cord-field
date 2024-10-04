import { ApolloError, useQuery } from '@apollo/client';
import { NetworkStatus } from '@apollo/client/core';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useMemo } from 'react';
import { InputArg, PaginatedListInput, PaginatedListOutput } from '../../api';
import { ChangesetDiffItemFragment as DiffItem } from '../../common/fragments';
import {
  ChangesetItemFilterFn,
  useDeletedItemsOfChangeset,
} from '../Changeset';

export interface ListQueryResult<
  Item,
  List extends PaginatedListOutput<Item>,
  Data
> {
  loading: boolean;
  data?: List;
  error?: ApolloError;
  // The root object of the query result.
  root?: Data;
  loadMore: () => void;
  networkStatus: NetworkStatus;
}

type ListQueryOptions<
  Data,
  Variables extends InputArg<PaginatedListInput>,
  List extends PaginatedListOutput<Item>,
  Item,
  RemovedItem extends DiffItem
> = QueryHookOptions<Data, Variables> & {
  /** Where in the query result is the list? */
  listAt: (data: Data) => List;
  /** Filter to the changeset removed items list to ones to include here */
  changesetRemovedItems?: ChangesetItemFilterFn<RemovedItem>;
};

export const useListQuery = <
  Data,
  Variables extends InputArg<PaginatedListInput>,
  Item,
  List extends PaginatedListOutput<Item>,
  RemovedItem extends DiffItem
>(
  doc: TypedDocumentNode<Data, Variables>,
  options: ListQueryOptions<Data, Variables, List, Item, RemovedItem>
): ListQueryResult<Item, List, Data> => {
  const { listAt, changesetRemovedItems, ...opts } = options;
  const {
    loading,
    data: res,
    error,
    fetchMore,
    networkStatus,
  } = useQuery(doc, {
    ...opts,
    notifyOnNetworkStatusChange: true,
  });
  const deleted = useDeletedItemsOfChangeset(changesetRemovedItems);
  const data = useMemo(() => {
    if (!res) {
      return undefined;
    }
    const d = listAt(res);
    return {
      ...d,
      items: [...d.items, ...deleted],
    };
  }, [listAt, res, deleted]);

  const loadMore = () => {
    if (!data) {
      return;
    }
    void fetchMore({
      variables: {
        ...options.variables,
        input: {
          ...options.variables?.input,
          page: data.nextPage,
        },
      },
    });
  };

  return { loading, data, error, loadMore, networkStatus, root: res };
};
