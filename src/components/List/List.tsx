import { Box, Grid, GridProps, Typography } from '@mui/material';
import { times } from 'lodash';
import { ReactNode, RefObject, useRef } from 'react';
import { Entity, isNetworkRequestInFlight, PaginatedListOutput } from '~/api';
import { extendSx, StyleProps } from '~/common';
import { usePersistedScroll } from '../../hooks/usePersistedScroll';
import { ChangesetBadge, useDetermineChangesetDiffItem } from '../Changeset';
import { Error } from '../Error';
import { FormattedNumber } from '../Formatters';
import { ProgressButton, ProgressButtonProps } from '../ProgressButton';
import { ListQueryResult } from './useListQuery';

export interface ListProps<Item extends Entity>
  extends ListQueryResult<
      Item,
      PaginatedListOutput<Item> & { canCreate?: boolean },
      unknown
    >,
    Pick<GridProps, 'spacing'> {
  renderItem: (item: Item) => ReactNode;
  renderSkeleton: ReactNode | ((index: number) => ReactNode);
  renderCreate?: ReactNode;
  /** Shown when the list has loaded with no items. Defaults to "No results found". */
  renderEmpty?: ReactNode;
  /** Show a "Total Rows" count above the list (matching the data grid). */
  showCount?: boolean;
  /**
   * Bleed the scroll area into a negative-margin gutter so a per-item
   * `ChangesetBadge` isn't clipped at the edge. On by default (card lists);
   * pass `false` for flush row lists that supply their own spacing.
   */
  bleed?: boolean;
  skeletonCount?: number;
  ContainerProps?: GridProps;
  ItemProps?: GridProps;
  DataItemProps?: GridProps;
  SkeletonItemProps?: GridProps;
  CreateItemProps?: GridProps;
  LoadMoreItemProps?: GridProps;
  LoadMoreButtonProps?: ProgressButtonProps;
  /** Reference to the element that is actually scrolling, if it's not this list */
  scrollRef?: RefObject<HTMLElement>;
}

export const List = <Item extends Entity>(
  props: ListProps<Item> & StyleProps
) => {
  const {
    networkStatus,
    data,
    error,
    loadMore,
    skeletonCount = 5,
    renderItem,
    renderSkeleton,
    renderCreate,
    renderEmpty,
    showCount,
    bleed = true,
    ContainerProps,
    spacing = 2,
    ItemProps,
    SkeletonItemProps,
    DataItemProps,
    CreateItemProps,
    LoadMoreItemProps,
    LoadMoreButtonProps,
    scrollRef: scrollRefProp,
    sx,
  } = props;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  usePersistedScroll(scrollRefProp ?? scrollRef);
  const determineChangesetDiff = useDetermineChangesetDiffItem();

  return (
    <>
      {showCount && data && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ px: 2, pb: 1, flexShrink: 0 }}
        >
          Total Rows: <FormattedNumber value={data.total} />
        </Typography>
      )}
      <Box
        sx={[{ overflow: 'auto' }, bleed && { ml: -2, p: 2 }, ...extendSx(sx)]}
        ref={scrollRef}
      >
        <Grid
          direction="column"
          spacing={spacing}
          {...ContainerProps}
          container
        >
          {error && !data?.items ? (
            <Grid item xs={12}>
              <Error error={error}>Error loading list</Error>
            </Grid>
          ) : !data?.items ? (
            times(skeletonCount).map((index) => (
              <Grid {...ItemProps} {...SkeletonItemProps} item key={index}>
                {typeof renderSkeleton === 'function'
                  ? renderSkeleton(index)
                  : renderSkeleton}
              </Grid>
            ))
          ) : (
            data.items.map((item) => (
              <Grid {...ItemProps} {...DataItemProps} item key={item.id}>
                <ChangesetBadge mode={determineChangesetDiff(item).mode}>
                  {renderItem(item)}
                </ChangesetBadge>
              </Grid>
            ))
          )}
          {data?.items &&
            data.items.length === 0 &&
            !(data.canCreate && renderCreate) && (
              <Grid item xs={12}>
                {renderEmpty ?? (
                  <Typography
                    color="text.secondary"
                    align="center"
                    sx={{ py: 4 }}
                  >
                    No results found
                  </Typography>
                )}
              </Grid>
            )}
          {data?.canCreate && renderCreate && (
            <Grid {...ItemProps} {...CreateItemProps} item>
              {renderCreate}
            </Grid>
          )}
          {data?.hasMore && (
            <Grid {...ItemProps} {...LoadMoreItemProps} item>
              <ProgressButton
                color="primary"
                fullWidth
                {...LoadMoreButtonProps}
                progress={isNetworkRequestInFlight(networkStatus)}
                disabled={isNetworkRequestInFlight(networkStatus)}
                onClick={loadMore}
              >
                Load More
              </ProgressButton>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};
