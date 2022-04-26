import { startCase } from 'lodash';
import {
  LocationType,
  PostShareability,
  PostShareabilityLabels,
  ProductApproachLabels,
  ProductMedium,
  ProductMediumLabels,
  ProductMethodology,
  ProductMethodologyLabels,
  ProgressMeasurement,
  ScriptureRangeInput,
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

export const displayLocationType = (type: Nullable<LocationType>): string =>
  !type ? '' : type === 'CrossBorderArea' ? 'Cross-Border Area' : type;

export const displayMethodology = (methodology: ProductMethodology) =>
  methodology.includes('Other')
    ? 'Other'
    : ProductMethodologyLabels[methodology];

export const displayMethodologyWithLabel = (methodology: ProductMethodology) =>
  `${
    ProductApproachLabels[MethodologyToApproach[methodology]]
  } - ${displayMethodology(methodology)}`;

export const displayScripture = ({ start, end }: ScriptureRangeInput) =>
  `${start.book} ${start.chapter}:${start.verse} -  ${end.chapter}:${end.verse}`;

export const displayProductMedium = (medium: ProductMedium) =>
  medium === 'EBook' ? 'E-Book' : ProductMediumLabels[medium];

export const displayProductTypes = (type: ProductTypes) =>
  type === 'DirectScriptureProduct' ? 'Scripture' : startCase(type);

export const displayPostShareability = (val: PostShareability) =>
  val === 'ProjectTeam' || val === 'Membership'
    ? 'Team Members'
    : PostShareabilityLabels[val];

export const displayProgressMeasurement = (value: ProgressMeasurement) =>
  value === 'Boolean' ? 'Done / Not Done' : value;
