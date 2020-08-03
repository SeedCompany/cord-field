import { DateTime } from 'luxon';
import * as React from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardFragment } from './ProductCard.generated';

export default {
  title: 'Components',
};

// const productType = select('Type', {
//   Scripture: DirectScriptureProduct,
// });

const product: ProductCardFragment = {
  id: '0958d98477',
  scriptureReferences: {
    canRead: true,
    canEdit: true,
    value: [],
    __typename: 'SecuredScriptureRanges',
  },
  mediums: {
    canRead: true,
    canEdit: true,
    value: ['Audio', 'EBook'],
    __typename: 'SecuredProductMediums',
  },
  methodology: {
    canRead: true,
    canEdit: true,
    value: 'BibleStorying',
    __typename: 'SecuredMethodology',
  },
  __typename: 'DerivativeScriptureProduct',
  produces: {
    canRead: true,
    canEdit: true,
    value: {
      __typename: 'Song',
      createdAt: DateTime.local(),
    },
  },
};

export const Product = () => <ProductCard product={product} />;
