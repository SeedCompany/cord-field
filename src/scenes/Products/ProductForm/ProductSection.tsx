import { Typography } from '@material-ui/core';
import React, { ComponentType } from 'react';
import { displayProductTypes } from '../../../api';
import { FieldConfig } from '../../../components/form';
import {
  EthnoArtField,
  EthnoArtLookupItem,
  FilmField,
  FilmLookupItem,
  LiteracyMaterialField,
  LiteracyMaterialLookupItem,
  SongField,
  SongLookupItem,
  StoryField,
  StoryLookupItem,
} from '../../../components/form/Lookup';
import { ProductTypes } from './constants';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

declare module './ProductForm' {
  interface ProductFormCustomValues {
    productType?: ProductTypes;
    produces?:
      | FilmLookupItem
      | StoryLookupItem
      | LiteracyMaterialLookupItem
      | SongLookupItem
      | EthnoArtLookupItem;
  }
}

type AnyFormFieldComponent = ComponentType<FieldConfig<any, any, any>>;

const productFieldMap: Partial<Record<ProductTypes, AnyFormFieldComponent>> = {
  Film: FilmField,
  Story: StoryField,
  LiteracyMaterial: LiteracyMaterialField,
  Song: SongField,
  EthnoArt: EthnoArtField,
};

export const ProductSection = ({
  product,
  touched,
  values,
  accordionState,
}: SectionProps) => {
  const { productType, produces } = values.product ?? {};

  if (
    !productType ||
    productType === 'DerivativeScriptureProduct' ||
    productType === 'Other' ||
    productType === 'DirectScriptureProduct'
  ) {
    return null;
  }

  const isProducesFieldMissing =
    !produces &&
    (touched?.['product.produces'] !== undefined ||
      !touched?.['product.produces']);

  return (
    <SecuredAccordion
      name="produces"
      {...accordionState}
      product={isProducesFieldMissing ? undefined : product}
      title={() => (
        <Typography variant="h4">
          {`${displayProductTypes(productType)} ${
            produces?.name.value ? `- ${produces.name.value}` : ''
          }`}
        </Typography>
      )}
      renderCollapsed={() => <></>}
    >
      {(props) => {
        const ProductField = productFieldMap[productType];
        return ProductField ? <ProductField {...props} required /> : null;
      }}
    </SecuredAccordion>
  );
};
