import { ProductCardFragment } from '../components/ProductCard/ProductCard.generated';

export const getProductType = (product?: ProductCardFragment) =>
  product?.__typename === 'DerivativeScriptureProduct'
    ? product.produces.value?.__typename || 'DerivativeScriptureProduct'
    : product?.__typename;

export const getProducibleName = (product: ProductCardFragment) =>
  product.__typename === 'DerivativeScriptureProduct' &&
  (product.produces.value?.__typename === 'Film'
    ? product.produces.value.name.value
    : product.produces.value?.__typename === 'LiteracyMaterial'
    ? product.produces.value.name.value
    : product.produces.value?.__typename === 'Song'
    ? product.produces.value.name.value
    : product.produces.value?.__typename === 'Story'
    ? product.produces.value.name.value
    : '');
