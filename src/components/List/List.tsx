import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { times } from 'lodash';
import { ReactNode } from 'react';
import * as React from 'react';
import { isNetworkRequestInFlight } from '../../api';
import { UseStyles } from '../../util';
import { ProgressButton } from '../ProgressButton';
import { ListQueryResult } from './useListQuery';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflow: 'auto',
    marginLeft: spacing(-2),
    padding: spacing(2),
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export interface ListProps<Item>
  extends ListQueryResult<Item>,
    UseStyles<typeof useStyles> {
  renderItem: (item: Item) => ReactNode;
  renderSkeleton: (index: number) => ReactNode;
  skeletonCount?: number;
  className?: string;
}

export const List = <Item extends any>(props: ListProps<Item>) => {
  const {
    networkStatus,
    data,
    loadMore,
    skeletonCount = 5,
    renderItem,
    renderSkeleton,
    className,
  } = props;
  const classes = useStyles(props);

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.items}>
        {!data?.items
          ? times(skeletonCount).map(renderSkeleton)
          : data.items.map((item) => renderItem(item))}

        {data?.hasMore && (
          <ProgressButton
            color="primary"
            progress={isNetworkRequestInFlight(networkStatus)}
            onClick={loadMore}
          >
            Load More
          </ProgressButton>
        )}
      </div>
    </div>
  );
};
