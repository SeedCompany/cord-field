import { action } from '@storybook/addon-actions';
import { number, object, select, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import * as React from 'react';
import {
  newTestament,
  oldTestament,
} from '../../scenes/Products/ProductForm/constants';
import { ProductCard } from './ProductCard';
import { ProductCardFragment } from './ProductCard.generated';

export default {
  title: 'Components',
  decorators: [
    (Story: React.FC) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

const derivativeScriptureProducts = [
  'Song',
  'Story',
  'Film',
  'LiteracyMaterial',
] as const;

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

  const getScriptureRange = () => {
    const books = [...oldTestament, ...newTestament];
    const book = books[Math.floor(Math.random() * books.length)];
    return {
      start: {
        book,
        chapter: Math.ceil(Math.random() * 20),
        verse: Math.ceil(Math.random() * 20),
      },
      end: {
        book,
        chapter: Math.ceil(Math.random() * 20),
        verse: Math.ceil(Math.random() * 20),
      },
    };
  };

  const getScriptureRangeArray = () => {
    const scriptureCount = number('Number of Scripture Ranges', 1, {
      range: true,
      min: 0,
      max: 20,
      step: 1,
    });
    const scriptureRangeArray = [];
    for (let i = 1; i <= scriptureCount; i++) {
      scriptureRangeArray.push(getScriptureRange());
    }
    return scriptureRangeArray;
  };

  const sharedValues: Pick<
    ProductCardFragment,
    'id' | 'scriptureReferences' | 'mediums' | 'methodology'
  > = {
    id: '0958d98477',
    scriptureReferences: {
      canRead: true,
      canEdit: true,
      value: getScriptureRangeArray(),
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
    derivativeScriptureProducts,
    'Story'
  );

  const derivativeProduct: ProductCardFragment = {
    ...sharedValues,
    __typename: 'DerivativeScriptureProduct',
    produces: {
      canRead: true,
      canEdit: true,
      value: {
        __typename: productType,
        id: '123',
        name: {
          canRead: true,
          canEdit: true,
          value: text('Producible Name', 'My Childhood Story'),
        },
        createdAt: DateTime.local(),
      },
    },
  };

  return derivativeScriptureProducts.includes(productType)
    ? derivativeProduct
    : directProduct;
};

export const Product = () => (
  <ProductCard product={getProduct()} handleDelete={action('delete clicked')} />
);
