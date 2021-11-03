import { startCase } from 'lodash';
import { ProductTypes } from '../scenes/Products/ProductForm/constants';
import { Nullable } from '../util';
import { MethodologyToApproach } from './approach';
import {
  EngagementStatus,
  FinancialReportingType,
  InternshipDomain,
  InternshipPosition,
  InternshipProgram,
  LocationType,
  PartnershipAgreementStatus,
  PartnerType,
  PostShareability,
  ProductApproach,
  ProductMedium,
  ProductMethodology,
  ProductPurpose,
  ProductStep,
  ProgressMeasurement,
  ProjectChangeRequestStatus,
  ProjectChangeRequestType,
  ProjectStatus,
  ProjectStep,
  Role,
  ScriptureRangeInput,
} from './schema.generated';

// Helper to display enums in a generic way
const displayEnum =
  <T extends string>() =>
  (enumVal: Nullable<T>) =>
    startCase(enumVal ?? undefined);
const displayEnums =
  <T extends string>(fn: (val: Nullable<T>) => string) =>
  (items: readonly T[]) =>
    items.map(fn).join(', ');

export const displayStatus = displayEnum<ProjectStatus>();
export const displayProjectStep = displayEnum<ProjectStep>();
export const displayPartnershipStatus =
  displayEnum<PartnershipAgreementStatus>();
export const displayPartnerType = displayEnum<PartnerType>();
export const displayFinancialReportingType =
  displayEnum<FinancialReportingType>();
export const displayEngagementStatus = displayEnum<EngagementStatus>();
export const displayRole = displayEnum<Role>();
export const displayRoles = displayEnums(displayRole);

export const displayInternPosition = displayEnum<InternshipPosition>();
export const displayInternProgram = displayEnum<InternshipProgram>();
export const displayInternDomain = displayEnum<InternshipDomain>();
export const displayPlanChangeStatus =
  displayEnum<ProjectChangeRequestStatus>();
export const displayProjectChangeRequestType =
  displayEnum<ProjectChangeRequestType>();
export const displayProjectChangeRequestTypes = displayEnums(
  displayProjectChangeRequestType
);
export const PartnershipStatuses: PartnershipAgreementStatus[] = [
  'NotAttached',
  'AwaitingSignature',
  'Signed',
];

export const displayLocationType = (type: Nullable<LocationType>): string =>
  !type ? '' : type === 'CrossBorderArea' ? 'Cross-Border Area' : type;

export const displayMethodology = (methodology: ProductMethodology) =>
  methodology.includes('Other')
    ? 'Other'
    : displayEnum<ProductMethodology>()(methodology);

export const displayApproach = displayEnum<ProductApproach>();

export const displayMethodologyWithLabel = (methodology: ProductMethodology) =>
  `${displayApproach(
    MethodologyToApproach[methodology]
  )} - ${displayMethodology(methodology)}`;

export const displayScripture = ({ start, end }: ScriptureRangeInput) =>
  `${start.book} ${start.chapter}:${start.verse} -  ${end.chapter}:${end.verse}`;

export const displayProductMedium = (medium: ProductMedium) =>
  medium === 'EBook' ? 'E-Book' : displayEnum<ProductMedium>()(medium);

export const displayProductPurpose = displayEnum<ProductPurpose>();

export const displayProductTypes = (type: ProductTypes) =>
  type === 'DirectScriptureProduct'
    ? 'Scripture'
    : displayEnum<ProductTypes>()(type);

export const displayPostShareability = displayEnum<PostShareability>();

export const displayProductStep = (step: Nullable<ProductStep>) =>
  displayEnum<ProductStep>()(step).replace(' And ', ' & ');

export const displayProgressMeasurement = (value: ProgressMeasurement) =>
  value === 'Boolean' ? 'Done / Not Done' : value;
