import React, { FC, useEffect, useRef } from 'react';
import InfiniteScroll, {
  Props as InfiniteScrollProps,
} from 'react-infinite-scroll-component';
import { useWindowSize } from 'react-use';

interface VirtualListProps
  extends Pick<
    InfiniteScrollProps,
    // Add items here as needed
    'dataLength' | 'next' | 'hasMore' | 'loader' | 'endMessage'
  > {
  // Used to estimate number of items to query per page
  setContainerHeight: (height: number) => void;
}

export const VirtualList: FC<VirtualListProps> = (props) => {
  const {
    setContainerHeight,
    children,
    dataLength,
    next,
    hasMore,
    loader,
    endMessage,
  } = props;

  const { height: windowHeight } = useWindowSize();
  const containerHeightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setContainerHeight(
      containerHeightRef.current?.getBoundingClientRect().height ?? windowHeight
    );
  }, [setContainerHeight, windowHeight]);

  return (
    <div
      id="scrollParent"
      style={{ height: '100%', flex: 1, overflowY: 'auto' }}
      ref={containerHeightRef}
    >
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        loader={loader}
        endMessage={endMessage}
        scrollableTarget="scrollParent"
      >
        {children}
      </InfiniteScroll>
    </div>
  );
};
