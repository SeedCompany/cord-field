import { ButtonProps, Grid, GridProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { times } from 'lodash';
import { ReactNode, useRef } from 'react';
import * as React from 'react';
import { isNetworkRequestInFlight, PaginatedListOutput } from '../../api';
import { usePersistedScroll } from '../../hooks/usePersistedScroll';
import { UseStyles } from '../../util';
import { ProgressButton } from '../ProgressButton';
import { ListQueryResult } from './useListQuery';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflow: 'auto',
    marginLeft: spacing(-2),
    padding: spacing(2),
  },
  container: {},
}));

export interface ListProps<Item>
  extends ListQueryResult<Item, PaginatedListOutput<Item>, unknown>,
    Pick<GridProps, 'spacing'>,
    UseStyles<typeof useStyles> {
  renderItem: (item: Item) => ReactNode;
  renderSkeleton: ReactNode | ((index: number) => ReactNode);
  skeletonCount?: number;
  ContainerProps?: GridProps;
  ItemProps?: GridProps;
  DataItemProps?: GridProps;
  SkeletonItemProps?: GridProps;
  LoadMoreItemProps?: GridProps;
  LoadMoreButtonProps?: ButtonProps;
  className?: string;
}

export const List = <Item extends { id: string }>(props: ListProps<Item>) => {
  const {
    networkStatus,
    data,
    loadMore,
    skeletonCount = 5,
    renderItem,
    renderSkeleton,
    ContainerProps,
    spacing = 2,
    ItemProps,
    SkeletonItemProps,
    DataItemProps,
    LoadMoreItemProps,
    LoadMoreButtonProps,
    className,
  } = props;
  const classes = useStyles(props);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  usePersistedScroll(scrollRef);

  return (
    <div className={clsx(classes.root, className)} ref={scrollRef}>
      <Grid
        direction="column"
        spacing={spacing}
        {...ContainerProps}
        container
        className={classes.container}
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
                {renderItem(item)}
              </Grid>
            ))}
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
    </div>
  );
};
