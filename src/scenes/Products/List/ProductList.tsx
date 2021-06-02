import { Card, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { List, useListQuery } from '../../../components/List';
import { ProductCard } from '../../../components/ProductCard';
import { ProductListDocument } from './ProductList.generated';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    margin: 0,
    overflow: 'visible',
    flex: 1,
  },
}));

export const ProductList = ({ engagementId }: { engagementId: string }) => {
  const classes = useStyles();
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
      className={classes.root}
      ContainerProps={{ direction: 'column', spacing: 3, wrap: 'nowrap' }}
      LoadMoreButtonProps={{ fullWidth: false }}
      renderItem={(product) => <ProductCard product={product} />}
      renderSkeleton={<Card />}
    />
  );
};
