import { makeStyles } from '@material-ui/core';
import React, { ComponentType, ReactNode } from 'react';
import {
  AutoSizer,
  Index,
  IndexRange,
  InfiniteLoader,
  List,
  ListRowProps,
  WindowScroller,
} from 'react-virtualized';
import { Promisable } from 'type-fest';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ITEM_MARGIN = 1;

interface InfiniteLoaderDataProps {
  /** Function responsible for tracking the loaded state of each row. */
  isRowLoaded?: (params: Index) => boolean;
  /**
   * Callback to be invoked when more rows must be loaded.
   * The returned Promise should be resolved once row data has finished loading.
   * It will be used to determine when to refresh the list with the newly-loaded data.
   * This callback may be called multiple times in reaction to a single scroll event.
   */
  loadMoreRows?: (params: IndexRange) => Promisable<void>;
}

export interface ItemProps<T> extends ListRowProps {
  item: T;
}
export interface VirtualListItemProps<T> {
  ItemComponent: ComponentType<ItemProps<T>>;
  itemHeight: number;
}

type ListViewProps<T> = InfiniteLoaderDataProps &
  VirtualListItemProps<T> & {
    list: T[];
    total?: number;
    empty?: ReactNode;
  };

export const VirtualList = <T extends any>({
  list,
  total: totalProp,
  empty,
  isRowLoaded = ({ index }) => Boolean(list[index]),
  loadMoreRows,
  ItemComponent,
  itemHeight: itemHeightProp,
}: ListViewProps<T>) => {
  const classes = useStyles();

  const itemHeight = itemHeightProp + ITEM_MARGIN * 8 * 2;
  const total = totalProp != null ? totalProp : list.length;

  return (
    <div className={classes.root}>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={async (input) => loadMoreRows?.(input)}
        rowCount={total}
        minimumBatchSize={3}
        threshold={3}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width }) => (
              <WindowScroller>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <List
                    ref={registerChild}
                    autoHeight
                    height={height}
                    width={width}
                    rowCount={total}
                    rowHeight={itemHeight}
                    onRowsRendered={onRowsRendered}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    overscanRowCount={100}
                    noRowsRenderer={() => empty as JSX.Element}
                    rowRenderer={({ key, ...props }) => {
                      return (
                        <ItemComponent
                          key={`virtual-list-row-${props.index}`}
                          item={list[props.index]}
                          {...props}
                        />
                      );
                    }}
                  />
                )}
              </WindowScroller>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
};
