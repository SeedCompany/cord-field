import { Card, makeStyles, Typography } from '@mui/material';
import { getChangeset } from '~/api';
import { IdFragment } from '~/common';
import { List, useListQuery } from '../../../components/List';
import { ProductCard } from '../../../components/ProductCard';
import { ProductListDocument } from './ProductList.graphql';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    margin: 0,
    overflow: 'visible',
    flex: 1,
  },
}));

export const ProductList = ({ engagement }: { engagement: IdFragment }) => {
  const classes = useStyles();

  const list = useListQuery(ProductListDocument, {
    variables: {
      engagement: engagement.id,
      changeset: getChangeset(engagement)?.id,
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
      spacing={1}
      renderItem={(product) => <ProductCard product={product} />}
      renderSkeleton={<Card />}
    />
  );
};
