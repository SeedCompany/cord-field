import { Card, Typography } from '@material-ui/core';
import React from 'react';
import { List, useListQuery } from '../../../components/List';
import { AddProductCard, ProductCard } from '../../../components/ProductCard';
import { ProductListDocument } from './ProductList.generated';

export const ProductList = ({ engagementId }: { engagementId: string }) => {
  const list = useListQuery(ProductListDocument, {
    variables: {
      engagement: engagementId,
    },
    listAt: (data) =>
      data.engagement.__typename === 'LanguageEngagement'
        ? data.engagement.products
        : {
            items: [],
            total: 0,
            hasMore: false,
            canRead: true,
            canCreate: false,
          },
  });

  if (list.data?.canRead === false) {
    return (
      <Typography color="textSecondary">
        You don't have permission to see this engagement's products
      </Typography>
    );
  }

  return (
    <List
      {...list}
      ContainerProps={{ direction: 'row', spacing: 3 }}
      ItemProps={{ xs: 4 }}
      LoadMoreItemProps={{ xs: 12 }}
      LoadMoreButtonProps={{ fullWidth: false }}
      renderItem={(product) => <ProductCard product={product} />}
      renderSkeleton={<Card />}
      renderCreate={<AddProductCard />}
    />
  );
};
