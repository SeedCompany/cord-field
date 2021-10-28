import { Grid } from '@material-ui/core';
import { Dictionary, keys } from 'lodash';
import React from 'react';
import { ProductCardFragment } from '../../../../components/ProductCard/ProductCard.generated';
import { AvailableMethodologyStepsFragment } from '../../../Products/ProductForm/ProductForm.generated';
import { ProductTable } from './ProductTable';

interface ProductTableListProps {
  products: Dictionary<ProductCardFragment[]>;
  methodologyAvailableSteps: readonly AvailableMethodologyStepsFragment[];
}

export const ProductTableList = ({
  products: groupedProducts,
  methodologyAvailableSteps,
}: ProductTableListProps) => {
  return (
    <Grid container spacing={4} direction="column">
      {keys(groupedProducts).map((category) => (
        <Grid item key={category} style={{ width: '100%' }}>
          <ProductTable
            category={category}
            products={groupedProducts[category] ?? []}
            methodologyAvailableSteps={methodologyAvailableSteps}
          />
        </Grid>
      ))}
    </Grid>
  );
};
