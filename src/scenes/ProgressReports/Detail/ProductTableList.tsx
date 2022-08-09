import { Skeleton, Typography } from '@mui/material';
import { groupBy } from 'lodash';
import { ProductTable } from './ProductTable';
import { ProgressOfProductForReportFragment } from './ProgressReportDetail.graphql';

interface ProductTableListProps {
  products?: readonly ProgressOfProductForReportFragment[];
}

export const ProductTableList = ({ products }: ProductTableListProps) => {
  const grouped = groupBy(products, (product) => product.product.category);

  return (
    <>
      <Typography variant="h3">
        {products ? 'Progress for Goals' : <Skeleton width="25%" />}
      </Typography>
      {Object.entries(grouped).map(([category, products]) => (
        <ProductTable key={category} category={category} products={products} />
      ))}
    </>
  );
};
