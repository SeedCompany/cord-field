import { Typography } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React, { ComponentType } from 'react';
import { displayProductTypes } from '../../../api';
import { EnumField, FieldConfig } from '../../../components/form';
import {
  FilmField,
  FilmLookupItem,
  LiteracyMaterialField,
  LiteracyMaterialLookupItem,
  SongField,
  SongLookupItem,
  StoryField,
  StoryLookupItem,
} from '../../../components/form/Lookup';
import { ProductTypes, productTypes } from './constants';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

declare module './ProductForm' {
  interface ProductFormCustomValues {
    productType?: ProductTypes;
    produces?:
      | FilmLookupItem
      | StoryLookupItem
      | LiteracyMaterialLookupItem
      | SongLookupItem;
  }
}

type AnyFormFieldComponent = ComponentType<FieldConfig<any, any, any>>;

const productFieldMap: Partial<Record<ProductTypes, AnyFormFieldComponent>> = {
  Film: FilmField,
  Story: StoryField,
  LiteracyMaterial: LiteracyMaterialField,
  Song: SongField,
};

export const ProducesSection = ({
  product,
  touched,
  values,
  accordionState,
}: SectionProps) => {
  const isEditing = Boolean(product);
  const { productType, produces } = values.product ?? {};

  const isProducesFieldMissing =
    productType !== 'DirectScriptureProduct' &&
    !produces &&
    (touched?.['product.produces'] !== undefined ||
      !touched?.['product.produces']);

  return (
    <SecuredAccordion
      name="produces"
      {...accordionState}
      product={isProducesFieldMissing ? undefined : product}
      title="Goal"
      renderCollapsed={() => (
        <>
          {productType && (
            <ToggleButton selected value={produces || ''}>
              {`${displayProductTypes(productType)} ${
                (productType !== 'DirectScriptureProduct' &&
                  produces?.name.value) ||
                ''
              }`}
            </ToggleButton>
          )}
          {isProducesFieldMissing && !isEditing && (
            <Typography variant="caption" color="error">
              Goal selection required
            </Typography>
          )}
        </>
      )}
    >
      {(props) => {
        const productTypeField = (
          <EnumField
            name="productType"
            disabled={isEditing}
            options={productTypes}
            getLabel={displayProductTypes}
            defaultValue="DirectScriptureProduct"
            required
            variant="toggle-split"
          />
        );

        const ProductField = productType
          ? productFieldMap[productType]
          : undefined;
        const productField = ProductField && (
          <ProductField {...props} required />
        );

        return (
          <>
            {productTypeField}
            {productField}
          </>
        );
      }}
    </SecuredAccordion>
  );
};
