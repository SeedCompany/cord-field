import { gql } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { usePagedListQuery } from './usePagedListQuery';

const TestListDocument = gql`
  query TestList($input: TestListInput) {
    things(input: $input) {
      total
      hasMore
      items {
        id
        name
      }
    }
  }
` as TypedDocumentNode<any, any>;

const page = (ids: number[], hasMore: boolean) => ({
  things: {
    __typename: 'TestList',
    total: 4,
    hasMore,
    items: ids.map((id) => ({
      __typename: 'Thing',
      id: `${id}`,
      name: `Thing ${id}`,
    })),
  },
});

const wrapperWith = (mocks: readonly MockedResponse[]) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };

const renderPaged = (
  mocks: readonly MockedResponse[],
  variables: Record<string, any> = { input: {} }
) =>
  renderHook(
    ({ variables }) =>
      usePagedListQuery(TestListDocument, {
        listAt: (data: any) => data.things,
        variables,
      }),
    { initialProps: { variables }, wrapper: wrapperWith(mocks) }
  );

describe('usePagedListQuery', () => {
  it('loads the first page', async () => {
    const { result } = renderPaged([
      {
        request: { query: TestListDocument, variables: { input: {} } },
        result: { data: page([1, 2], true) },
      },
    ]);
    await waitFor(() => expect(result.current.data?.items).toHaveLength(2));
    expect(result.current.data?.hasMore).toBe(true);
  });

  it('appends the next page on loadMore', async () => {
    const { result } = renderPaged([
      {
        request: { query: TestListDocument, variables: { input: {} } },
        result: { data: page([1, 2], true) },
      },
      {
        request: { query: TestListDocument, variables: { input: { page: 2 } } },
        result: { data: page([3, 4], false) },
      },
    ]);
    await waitFor(() => expect(result.current.data?.items).toHaveLength(2));

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.data?.items).toHaveLength(4));
    expect(result.current.data?.items.map((i: { id: string }) => i.id)).toEqual(
      ['1', '2', '3', '4']
    );
    expect(result.current.data?.hasMore).toBe(false);
  });

  it('guards against concurrent loadMore — a double tap fetches the page once', async () => {
    let page2Fetches = 0;
    const mocks: MockedResponse[] = [
      {
        request: { query: TestListDocument, variables: { input: {} } },
        result: { data: page([1, 2], true) },
      },
      // Two page-2 mocks are provided so that an unguarded double-fire would
      // succeed (and bump the counter to 2) rather than erroring — making the
      // guard the only thing keeping it at 1.
      ...[0, 1].map(() => ({
        request: { query: TestListDocument, variables: { input: { page: 2 } } },
        result: () => {
          page2Fetches++;
          return { data: page([3, 4], false) };
        },
      })),
    ];
    const { result } = renderPaged(mocks);
    await waitFor(() => expect(result.current.data?.items).toHaveLength(2));

    act(() => {
      result.current.loadMore();
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.data?.items).toHaveLength(4));
    expect(page2Fetches).toBe(1);
  });

  it('resets accumulated pages when variables change away and back', async () => {
    const variablesA = { input: { filter: { name: 'A' } } };
    const variablesB = { input: { filter: { name: 'B' } } };
    const { result, rerender } = renderPaged(
      [
        {
          request: { query: TestListDocument, variables: variablesA },
          result: { data: page([1, 2], true) },
        },
        {
          request: {
            query: TestListDocument,
            variables: { input: { filter: { name: 'A' }, page: 2 } },
          },
          result: { data: page([3, 4], false) },
        },
        {
          request: { query: TestListDocument, variables: variablesB },
          result: { data: page([10, 11], false) },
        },
      ],
      variablesA
    );

    await waitFor(() => expect(result.current.data?.items).toHaveLength(2));
    act(() => {
      result.current.loadMore();
    });
    await waitFor(() => expect(result.current.data?.items).toHaveLength(4));

    rerender({ variables: variablesB });
    await waitFor(() =>
      expect(
        result.current.data?.items.map((item: { id: string }) => item.id)
      ).toEqual(['10', '11'])
    );

    rerender({ variables: variablesA });
    await waitFor(() =>
      expect(
        result.current.data?.items.map((item: { id: string }) => item.id)
      ).toEqual(['1', '2'])
    );
  });
});
