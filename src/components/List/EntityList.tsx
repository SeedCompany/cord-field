import { getOperationName } from '@apollo/client/utilities';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import { ReactNode, useMemo } from 'react';
import { Entity, PaginatedListOutput } from '~/api';
import { FormattedNumber } from '../Formatters';
import { useSession } from '../Session/Session';
import { EntityListItem } from './EntityListItem';
import {
  columnsToFilterControls,
  columnsToSortOptions,
  rowSecondary,
  SortState,
} from './gridColumnAdapters';
import { List } from './List';
import { useRowListFilters } from './MobileFilters';
import { usePagedListQuery } from './usePagedListQuery';

export interface EntityListProps<Data, Item extends Entity> {
  /** The list query — shares the grid's document, so the data already has every column's field. */
  query: TypedDocumentNode<Data, any>;
  /** Where the paginated list lives in the result (may be nested, e.g. `d.language.locations`). */
  listAt: (data: Data) => PaginatedListOutput<Item> & { canCreate?: boolean };
  /** Query variables other than `input` (e.g. a parent id); `input` is supplied by the drawer. */
  variables?: Record<string, any>;
  /**
   * Optional heading rendered on one row with the total count (title left,
   * "Total Rows" right), so the list reclaims the vertical space a separate
   * page heading above the count would take.
   */
  title?: ReactNode;
  /** The grid's columns — drive the filter/sort drawer and the labeled secondary. */
  columns: readonly GridColDef[];
  sortDefault: SortState;
  /**
   * Column field shown (labeled) as the secondary line while on the default
   * sort. Used only by the default row render — omit it when supplying `renderItem`.
   */
  defaultSecondaryField?: string;
  /** Row primary text. Required unless `renderItem` is supplied. */
  primary?: (item: Item) => ReactNode;
  /** Row navigation target. Required unless `renderItem` is supplied. */
  to?: (item: Item) => string;
  /** Leading element (e.g. a sensitivity icon), rendered raw in the row's avatar slot. */
  avatar?: (item: Item) => ReactNode;
  /** Override the whole row (e.g. a computed primary/secondary); receives the active sort field. */
  renderItem?: (item: Item, sort: string | undefined) => ReactNode;
}

/**
 * The mobile dense-list counterpart to a {@link DataGrid}, reusable for any list
 * scene or detail-page tab. Derives its filter/sort drawer + labeled secondary
 * from the grid's `columns`, drives a {@link usePagedListQuery}, and renders a
 * tappable {@link EntityListItem} per item. Self-contained: it clips horizontal
 * overflow and scrolls vertically, so it's safe inside the grid's
 * `containerType: size` tab panels.
 */
export function EntityList<Data, Item extends Entity>({
  query,
  listAt,
  variables,
  title,
  columns,
  sortDefault,
  defaultSecondaryField,
  primary,
  to,
  avatar,
  renderItem,
}: EntityListProps<Data, Item>) {
  const filterControls = useMemo(
    () => columnsToFilterControls(columns),
    [columns]
  );
  const sortOptions = useMemo(() => columnsToSortOptions(columns), [columns]);

  // Persist filter/sort per user + list, mirroring the data grid's stored view.
  const { session } = useSession();
  const opName = useMemo(() => getOperationName(query), [query]);
  const storageKey =
    opName && session?.id
      ? `${session.id}:${opName}-mobile-list-view`
      : undefined;

  const { filter, sort, order } = useRowListFilters(
    filterControls,
    { options: sortOptions, default: sortDefault },
    storageKey
  );

  // Merge the drawer's filter with any base scoping filter (e.g. a tool filter),
  // rather than overwriting it.
  const baseInput: Record<string, any> = variables?.input ?? {};
  const mergedFilter =
    baseInput.filter || filter ? { ...baseInput.filter, ...filter } : undefined;

  const list = usePagedListQuery(query, {
    listAt,
    variables: {
      ...variables,
      input: { ...baseInput, sort, order, filter: mergedFilter },
    },
  });

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {(title || list.data) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            pl: 0,
            pr: 2,
            pb: 2,
            flexShrink: 0,
          }}
        >
          {title && <Typography variant="h2">{title}</Typography>}
          {list.data && (
            <Typography
              variant="body2"
              color="text.secondary"
              // `ml: auto` keeps the count right-aligned whether or not a title
              // occupies the left of the row.
              sx={{ ml: 'auto', whiteSpace: 'nowrap' }}
            >
              Total Rows: <FormattedNumber value={list.data.total} />
            </Typography>
          )}
        </Box>
      )}
      <List
        {...list}
        bleed={false}
        sx={{ flex: 1 }}
        spacing={0}
        // The list is a single vertical column. MUI Grid containers default to
        // `flex-wrap: wrap`, so a `direction="column"` grid whose rows exceed the
        // available height wraps into extra COLUMNS — horizontal overflow. Force
        // nowrap so it stays one column and scrolls vertically instead.
        ContainerProps={{ wrap: 'nowrap' }}
        ItemProps={{ xs: 12 }}
        renderItem={(item) =>
          renderItem ? (
            renderItem(item, sort)
          ) : (
            <EntityListItem
              to={to?.(item)}
              avatar={avatar?.(item)}
              primary={primary?.(item)}
              secondary={rowSecondary(
                columns,
                sort,
                sortDefault.field,
                defaultSecondaryField,
                item
              )}
            />
          )
        }
        renderSkeleton={
          <EntityListItem loading avatar={!!avatar || undefined} />
        }
      />
    </Box>
  );
}
