import { ButtonProps, Grid, GridProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { times } from 'lodash';
import { ReactNode, RefObject, useContext, useRef } from 'react';
import * as React from 'react';
import { isNetworkRequestInFlight, PaginatedListOutput } from '../../api';
import { usePersistedScroll } from '../../hooks/usePersistedScroll';
import { UseStyles } from '../../util';
import { ChangesetBadge, ChangesetDiffContext } from '../Changeset';
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

interface Resource {
  __typename?: string;
  id: string;
}

export interface ListProps<Item extends Resource>
  extends ListQueryResult<
      Item,
      PaginatedListOutput<Item> & { canCreate?: boolean },
      unknown
    >,
    Pick<GridProps, 'spacing'>,
    UseStyles<typeof useStyles> {
  renderItem: (item: Item) => ReactNode;
  renderSkeleton: ReactNode | ((index: number) => ReactNode);
  renderCreate?: ReactNode;
  skeletonCount?: number;
  ContainerProps?: GridProps;
  ItemProps?: GridProps;
  DataItemProps?: GridProps;
  SkeletonItemProps?: GridProps;
  CreateItemProps?: GridProps;
  LoadMoreItemProps?: GridProps;
  LoadMoreButtonProps?: ButtonProps;
  /** Reference to the element that is actually scrolling, if it's not this list */
  scrollRef?: RefObject<HTMLElement>;
  className?: string;
}

export const List = <Item extends Resource>(props: ListProps<Item>) => {
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
    className,
  } = props;
  const classes = useStyles(props);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  usePersistedScroll(scrollRefProp ?? scrollRef);
  const changesetDiff = useContext(ChangesetDiffContext);

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
          : data.items.map((item) => {
              const equals = (res: Resource) =>
                res.__typename === item.__typename && res.id === item.id;
              const added = !!changesetDiff?.added.find(equals);
              const removed = !!changesetDiff?.removed.find(equals);
              return (
                <Grid {...ItemProps} {...DataItemProps} item key={item.id}>
                  <ChangesetBadge
                    mode={added ? 'added' : removed ? 'removed' : undefined}
                  >
                    {renderItem(item)}
                  </ChangesetBadge>
                </Grid>
              );
            })}
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
    </div>
  );
};
