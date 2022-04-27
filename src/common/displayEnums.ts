import { startCase } from 'lodash';
import {
  ProductApproachLabels,
  ProductMethodology,
  ProductMethodologyLabels,
} from '~/api/schema';
import { ProductTypes } from '../scenes/Products/ProductForm/constants';
import { Nullable } from '../util';
import { MethodologyToApproach } from './approach';

export const labelFrom =
  <T extends keyof any>(labels: Record<T, string>) =>
  (value: Nullable<T>) =>
    value ? labels[value] : '';

export const labelsFrom =
  <T extends keyof any>(labels: Record<T, string>) =>
  (values: Nullable<readonly T[]>) =>
    (values ?? []).map((val) => labels[val]).join(', ');

export const displayMethodology = (methodology: ProductMethodology) =>
  methodology.includes('Other')
    ? 'Other'
    : ProductMethodologyLabels[methodology];

export const displayMethodologyWithLabel = (methodology: ProductMethodology) =>
  `${
    ProductApproachLabels[MethodologyToApproach[methodology]]
  } - ${displayMethodology(methodology)}`;

export const displayProductTypes = (type: ProductTypes) =>
  type === 'DirectScriptureProduct' ? 'Scripture' : startCase(type);
