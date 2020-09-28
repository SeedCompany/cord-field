import { Box, makeStyles } from '@material-ui/core';
import { text } from '@storybook/addon-knobs';
import React, { FC, useEffect, useState } from 'react';
import { sleep } from '../../util';
import { calculateItemsPerPage } from './calculateItemsPerPage';
import { VirtualList as VL } from './VirtualList';

const useStyles = makeStyles(({ spacing }) => ({
  listItem: {
    width: 500,
    margin: spacing(2),
  },
}));

interface ListItemProps {
  height: 220 | 260 | 280;
  index: number;
}

const ListItem: FC<ListItemProps> = (props) => {
  const { height, index } = props;
  const classes = useStyles();
  return (
    <div className={classes.listItem} style={{ height }}>
      Item #{index}
    </div>
  );
};

export const VirtualList = () => {
  const [allItems, setAllItems] = useState<ListItemProps[]>([]);
  const [items, setItems] = useState<ListItemProps[]>([]);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const itemsPerPage = containerHeight
    ? calculateItemsPerPage(containerHeight, 240)
    : 5;

  const next = async () => {
    await sleep(750);
    const nextIndex = items.length;
    const stopIndex =
      nextIndex + itemsPerPage <= allItems.length
        ? nextIndex + itemsPerPage
        : -1;
    const newItems = allItems[nextIndex]
      ? [...items, ...allItems.slice(nextIndex, stopIndex)]
      : items;
    setItems(newItems);
  };

  useEffect(() => {
    void sleep(1200).then(() => {
      const randomItems: ListItemProps[] = Array(100)
        .fill(null)
        .map((_, index) => {
          const HEIGHTS = [220, 260, 280] as const;
          const heightIndex = Math.floor(Math.random() * HEIGHTS.length);
          const height = HEIGHTS[heightIndex];
          return {
            height: height,
            index,
          };
        });
      setAllItems(randomItems);
    });
  }, [setAllItems]);

  return (
    <Box width="80%">
      <VL
        dataLength={items.length}
        hasMore={items.length < allItems.length}
        itemType={text('itemType', '')}
        next={next}
        setContainerHeight={setContainerHeight}
      >
        {items.map((item) => (
          <ListItem key={item.index} index={item.index} height={item.height} />
        ))}
      </VL>
    </Box>
  );
};
