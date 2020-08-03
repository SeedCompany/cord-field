import { boolean, object, select } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import * as React from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardFragment } from './ProductCard.generated';

export default {
  title: 'Components',
};

const getProduct = () => {
  const methodologyValue = select(
    'Methodology',
    [
      'Paratext',
      'OtherWritten',
      'Render',
      'OtherOralTranslation',
      'BibleStories',
      'OneStory',
      'OtherOralStories',
      'Film',
      'SignLanguage',
      'OtherVisual',
    ],
    'Paratext'
  );

  const sharedValues: Pick<
    ProductCardFragment,
    'id' | 'scriptureReferences' | 'mediums' | 'methodology'
  > = {
    id: '0958d98477',
    scriptureReferences: {
      canRead: true,
      canEdit: true,
      value: [
        {
          start: {
            book: 'Jeremiah',
            chapter: 2,
            verse: 3,
          },
          end: {
            book: 'Jeremiah',
            chapter: 4,
            verse: 5,
          },
        },
        {
          start: {
            book: 'Acts',
            chapter: 6,
            verse: 7,
          },
          end: {
            book: 'Acts',
            chapter: 8,
            verse: 9,
          },
        },
      ],
      __typename: 'SecuredScriptureRanges',
    },
    mediums: {
      canRead: true,
      canEdit: true,
      value: object('Mediums', ['Print']),
      __typename: 'SecuredProductMediums',
    },
    methodology: {
      canRead: true,
      canEdit: true,
      value: methodologyValue,
      __typename: 'SecuredMethodology',
    },
  };

  const directProduct: ProductCardFragment = {
    ...sharedValues,
    __typename: 'DirectScriptureProduct',
  };

  const productType = select(
    'Product Type',
    ['Song', 'Story', 'Film', 'LiteracyMaterial'],
    'Song'
  );

  const derivativeProduct: ProductCardFragment = {
    ...sharedValues,
    __typename: 'DerivativeScriptureProduct',
    produces: {
      canRead: true,
      canEdit: true,
      value: {
        __typename: productType,
        createdAt: DateTime.local(),
      },
    },
  };

  const isDirectProduct = boolean('Direct Scripture Product?', true);

  return isDirectProduct ? directProduct : derivativeProduct;
};

export const Product = () => <ProductCard product={getProduct()} />;
