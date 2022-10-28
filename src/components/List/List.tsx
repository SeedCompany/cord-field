import { Box, Breakpoint, Grid, GridProps } from '@mui/material';
import { times } from 'lodash';
import { ReactNode, RefObject, useRef } from 'react';
import { Entity, isNetworkRequestInFlight, PaginatedListOutput } from '~/api';
import { extendSx, StyleProps } from '~/common';
import { usePersistedScroll } from '../../hooks/usePersistedScroll';
import { ChangesetBadge, useDetermineChangesetDiffItem } from '../Changeset';
import { ProgressButton, ProgressButtonProps } from '../ProgressButton';
import { ListQueryResult } from './useListQuery';

export interface ListProps<Item extends Entity>
  extends ListQueryResult<
      Item,
      PaginatedListOutput<Item> & { canCreate?: boolean },
      unknown
    >,
    Pick<GridProps, 'spacing'>,
    StyleProps {
  renderItem: (item: Item) => ReactNode;
  renderSkeleton: ReactNode | ((index: number) => ReactNode);
  renderCreate?: ReactNode;
  skeletonCount?: number;
  ContainerProps?: GridProps;
  /** A shortcut to set the items max width */
  itemMaxWidth?: Breakpoint | number;
  ItemProps?: GridProps;
  DataItemProps?: GridProps;
  SkeletonItemProps?: GridProps;
  CreateItemProps?: GridProps;
  LoadMoreItemProps?: GridProps;
  LoadMoreButtonProps?: ProgressButtonProps;
  /** Reference to the element that is actually scrolling, if it's not this list */
  scrollRef?: RefObject<HTMLElement>;
}

export const List = <Item extends Entity>(props: ListProps<Item>) => {
  const {
    networkStatus,
    data,
    loadMore,
    skeletonCount = 5,
    renderItem,
    renderSkeleton,
    renderCreate,
    ContainerProps,
    spacing = 2,
    ItemProps,
    SkeletonItemProps,
    DataItemProps,
    CreateItemProps,
    LoadMoreItemProps,
    LoadMoreButtonProps,
    scrollRef: scrollRefProp,
    itemMaxWidth,
    className,
    sx,
  } = props;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  usePersistedScroll(scrollRefProp ?? scrollRef);
  const determineChangesetDiff = useDetermineChangesetDiffItem();

  return (
    <Box
      className={className}
      ref={scrollRef}
      sx={[
        (theme) => ({
          overflow: 'auto',
          marginLeft: theme.spacing(-2),
          padding: theme.spacing(2),
        }),
        ...extendSx(sx),
      ]}
    >
      <Grid
        direction="column"
        spacing={spacing}
        {...ContainerProps}
        container
        sx={[
          ...extendSx(ContainerProps?.sx),
          itemMaxWidth
            ? (theme) => ({
                maxWidth:
                  typeof itemMaxWidth === 'number'
                    ? itemMaxWidth
                    : theme.breakpoints.values[itemMaxWidth],
              })
            : {},
        ]}
      >
        {!data?.items
          ? times(skeletonCount).map((index) => (
              <Grid {...ItemProps} {...SkeletonItemProps} item key={index}>
                {typeof renderSkeleton === 'function'
                  ? renderSkeleton(index)
                  : renderSkeleton}
              </Grid>
            ))
          : data.items.map((item) => (
              <Grid {...ItemProps} {...DataItemProps} item key={item.id}>
                <ChangesetBadge mode={determineChangesetDiff(item).mode}>
                  {renderItem(item)}
                </ChangesetBadge>
              </Grid>
            ))}
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
              onClick={loadMore}
            >
              Load More
            </ProgressButton>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
