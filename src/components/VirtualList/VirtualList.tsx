import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import InfiniteScroll, {
  Props as InfiniteScrollProps,
} from 'react-infinite-scroll-component';
import { useWindowSize } from 'react-use';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    height: '100%',
    overflowY: 'auto',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    margin: spacing(4, 0),
  },
  endMessageContainer: {
    textAlign: 'center',
  },
  endMessage: {
    color: palette.grey[500],
  },
}));

interface VirtualListProps
  extends Pick<
    InfiniteScrollProps,
    // Add items here as needed
    'dataLength' | 'next' | 'hasMore'
  > {
  itemType?: string;
  // Used to estimate number of items to query per page
  setContainerHeight: (height: number) => void;
}

export const VirtualList: FC<VirtualListProps> = (props) => {
  const {
    dataLength,
    hasMore,
    itemType,
    next: nextProp,
    setContainerHeight,
    children,
  } = props;
  const classes = useStyles();
  const { height: windowHeight } = useWindowSize();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [childWidth, setChildWidth] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  /**
   * Get the height of the `div` wrapping the `InfiniteScroll` and
   * send it up to the consumer so it knows how many children to
   * query per page
   */
  useEffect(() => {
    setContainerHeight(
      containerRef.current?.getBoundingClientRect().height ?? windowHeight
    );
  }, [setContainerHeight, windowHeight]);

  /**
   * Get the width of the first rendered item so we can set our loading
   * and "end message" containers to that width; otherwise they fill up
   * the full width of the `div` wrapping the `InfiniteScroll`, which
   * might be quite wide
   */
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      /* eslint-disable @typescript-eslint/no-unnecessary-condition */
      const firstItem = container.getElementsByClassName(
        'infinite-scroll-component'
      )?.[0]?.firstElementChild;
      /* eslint-enable @typescript-eslint/no-unnecessary-condition */
      if (firstItem) {
        const width = firstItem.getBoundingClientRect().width;
        setChildWidth(width);
      }
    }
  }, [childWidth]);

  const next = async () => {
    setLoadingMore(true);
    await nextProp();
    setLoadingMore(false);
  };

  const statusStyle = childWidth ? { width: childWidth } : undefined;

  return (
    <div
      id="scrollParent"
      role="feed"
      aria-busy={loadingMore}
      className={classes.root}
      ref={containerRef}
    >
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        loader={
          <div className={classes.loading} style={statusStyle}>
            <CircularProgress size={20} />
          </div>
        }
        endMessage={
          <div className={classes.endMessageContainer} style={statusStyle}>
            <Typography variant="body1" className={classes.endMessage}>
              All {itemType ? `${itemType}s` : 'items'} retrieved
            </Typography>
          </div>
        }
        scrollableTarget="scrollParent"
      >
        {children}
      </InfiniteScroll>
    </div>
  );
};
