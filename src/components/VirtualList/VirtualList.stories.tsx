import React from 'react';
import { ListRowProps } from 'react-virtualized';
import { VirtualList as VL } from './VirtualList';

export default { title: 'Components' };

interface ListItem {
  name: string;
}

const listData = [...Array(100).keys()].map((key) => ({
  name: `List Item #${key + 1}`,
}));

const ItemComponent = ({ item, style }: { item: ListItem } & ListRowProps) => (
  <div
    style={{
      border: '1px solid #000',
      padding: 20,
      marginBottom: 10,
      ...style,
    }}
  >
    {item.name}
  </div>
);

export const VirtualList = () => (
  <VL<ListItem>
    ItemComponent={ItemComponent}
    itemHeight={100}
    list={listData}
  />
);
