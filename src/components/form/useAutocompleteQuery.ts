import { MaybeMasked, OperationVariables, useQuery } from '@apollo/client';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AutocompleteProps } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { Merge } from 'type-fest';
import { isNetworkRequestInFlight } from '../../api';

type AutocompleteQueryOptions<
  Data,
  Variables extends OperationVariables,
  Item
> = Merge<
  QueryHookOptions<Data, Variables>,
  {
    /** Where in the query result is the list? */
    listAt: (data: Data) => readonly Item[];
    variables: Variables | ((query: string | undefined) => Variables);
  }
>;

export type AutocompleteResult<Item, Data> = Pick<
  AutocompleteProps<Item, any, any, any>,
  'loading' | 'inputValue' | 'onInputChange'
> & {
  options: readonly Item[];
  // The root object of the query result.
  root?: MaybeMasked<Data>;
};

/**
 * A wrapper around useQuery for use with <AutocompleteField />
 */
export const useAutocompleteQuery = <
  Data,
  Variables extends OperationVariables,
  Item
>(
  doc: TypedDocumentNode<Data, Variables>,
  options: AutocompleteQueryOptions<Data, Variables, Item>
): AutocompleteResult<Item, Data> => {
  const { listAt, ...opts } = options;

  const [inputValue, setInputValue] = useState('');
  const onInputChange = useCallback(
    (_: unknown, input: string) => setInputValue(input),
    [setInputValue]
  );

  const { data: res, networkStatus } = useQuery(doc, {
    ...opts,
    variables:
      typeof options.variables === 'function'
        ? (options.variables as (query: string) => Variables)(inputValue)
        : options.variables,
    notifyOnNetworkStatusChange: true,
  });

  const data = useMemo(() => (!res ? [] : listAt(res)), [listAt, res]);

  return {
    loading: isNetworkRequestInFlight(networkStatus),
    options: data,
    root: res,
    inputValue,
    onInputChange,
  };
};
