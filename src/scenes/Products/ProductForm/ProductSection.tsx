import { Typography } from '@mui/material';
import { ComponentType, useEffect } from 'react';
import { displayProductTypes } from '~/common';
import { FieldConfig } from '../../../components/form';
import {
  EthnoArtField,
  EthnoArtLookupItem,
  FilmField,
  FilmLookupItem,
  StoryField,
  StoryLookupItem,
} from '../../../components/form/Lookup';
import { ProductTypes } from './constants';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

declare module './ProductForm' {
  interface ProductFormCustomValues {
    productType?: ProductTypes;
    produces?: FilmLookupItem | StoryLookupItem | EthnoArtLookupItem;
  }
}

type AnyFormFieldComponent = ComponentType<FieldConfig<any, any, any>>;

const productFieldMap: Partial<Record<ProductTypes, AnyFormFieldComponent>> = {
  Film: FilmField,
  Story: StoryField,
  EthnoArt: EthnoArtField,
};

export const ProductSection = ({
  product,
  form,
  touched,
  values,
  accordionState,
}: SectionProps) => {
  const { productType, produces } = values.product ?? {};

  useEffect(() => {
    if (!produces?.__typename) {
      return;
    } else if (productType !== produces.__typename) {
      // @ts-expect-error yes, the field exists.
      form.change('product.produces', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType]);

  if (
    !productType ||
    productType === 'DirectScriptureProduct' ||
    productType === 'Other'
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
        <Typography variant="h4" color="inherit">
          {`${displayProductTypes(productType)} ${
            produces?.name.value ? `- ${produces.name.value}` : ''
          }`}
        </Typography>
      )}
      renderCollapsed={() => null}
    >
      {(props) => {
        const ProductField = productFieldMap[productType];
        return ProductField ? <ProductField {...props} required /> : null;
      }}
    </SecuredAccordion>
  );
};
