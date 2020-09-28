import { Box, makeStyles, Typography } from '@material-ui/core';
import { number, text } from '@storybook/addon-knobs';
import React, { FC, useEffect, useState } from 'react';
import { sleep } from '../../util';
import { useItemsPerPage } from './calculateItemsPerPage';
import { VirtualList as VL } from './VirtualList';

export default { title: 'Components/VirtualList' };

const useStyles = makeStyles(({ palette, spacing }) => ({
  listItem: {
    border: `1px solid ${palette.divider}`,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing(2),
    padding: spacing(2, 4),
    width: 500,
  },
}));

interface ListItemProps {
  height: 80 | 120 | 140;
  index: number;
}

const ListItem: FC<ListItemProps> = (props) => {
  const { height, index } = props;
  const classes = useStyles();
  return (
    <div className={classes.listItem} style={{ height }}>
      <Typography variant="h3">Item #{index + 1}</Typography>
    </div>
  );
};

const itemType = text('itemType', '');
const numberOfItems = number('numberOfItems', 30);

export const VirtualList = () => {
  const [allItems, setAllItems] = useState<ListItemProps[]>([]);
  const [items, setItems] = useState<ListItemProps[]>([]);
  const [itemsPerPage, setContainerHeight] = useItemsPerPage(276);

  const next = async () => {
    await sleep(750);
    const nextIndex = items.length;
    const newItems = allItems[nextIndex]
      ? [...items, ...allItems.slice(nextIndex, nextIndex + itemsPerPage)]
      : items;
    setItems(newItems);
  };

  useEffect(() => {
    const randomItems: ListItemProps[] = Array(numberOfItems)
      .fill(null)
      .map((_, index) => {
        const HEIGHTS = [80, 120, 140] as const;
        const heightIndex = Math.floor(Math.random() * HEIGHTS.length);
        const height = HEIGHTS[heightIndex];
        return {
          height: height,
          index,
        };
      });
    setAllItems(randomItems);
  }, [setAllItems]);

  useEffect(() => {
    if (allItems.length > 0) {
      setItems(allItems.slice(0, itemsPerPage));
    }
  }, [allItems, setItems, itemsPerPage]);

  return (
    <Box width="60%" height={400}>
      {items.length > 0 && (
        <VL
          dataLength={items.length}
          hasMore={items.length < allItems.length}
          itemType={itemType}
          next={next}
          setContainerHeight={setContainerHeight}
        >
          {items.map((item) => (
            <ListItem
              key={item.index}
              index={item.index}
              height={item.height}
            />
          ))}
        </VL>
      )}
    </Box>
  );
};
