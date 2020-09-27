import { LinearProgress, makeStyles, Typography } from '@material-ui/core';
import React, { FC, useEffect, useRef } from 'react';
import InfiniteScroll, {
  Props as InfiniteScrollProps,
} from 'react-infinite-scroll-component';
import { useWindowSize } from 'react-use';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    overflowY: 'auto',
  },
  loader: {
    width: '100%',
  },
}));

interface VirtualListProps
  extends Pick<
    InfiniteScrollProps,
    // Add items here as needed
    'dataLength' | 'next' | 'hasMore'
  > {
  // Used to estimate number of items to query per page
  setContainerHeight: (height: number) => void;
}

export const VirtualList: FC<VirtualListProps> = (props) => {
  const { setContainerHeight, children, dataLength, next, hasMore } = props;

  const classes = useStyles();
  const { height: windowHeight } = useWindowSize();
  const containerHeightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainerHeight(
      containerHeightRef.current?.getBoundingClientRect().height ?? windowHeight
    );
  }, [setContainerHeight, windowHeight]);

  return (
    <div id="scrollParent" className={classes.root} ref={containerHeightRef}>
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        loader={
          <div className={classes.loader}>
            <LinearProgress color="secondary" />
          </div>
        }
        endMessage={
          <Typography variant="body1" color="textPrimary">
            All items retrieved
          </Typography>
        }
        scrollableTarget="scrollParent"
      >
        {children}
      </InfiniteScroll>
    </div>
  );
};
