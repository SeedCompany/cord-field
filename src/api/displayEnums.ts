import { startCase } from 'lodash';
import {
  EngagementStatus,
  FinancialReportingType,
  InternshipDomain,
  InternshipProgram,
  PartnershipAgreementStatus,
  ProductApproach,
  ProjectStatus,
  Role,
} from '.';
import { ProductTypes } from '../scenes/Products/ProductForm/constants';
import { Nullable } from '../util';
import { MethodologyToApproach } from './approach';
import {
  InternshipPosition,
  ProductMedium,
  ProductMethodology,
  ProductPurpose,
  ProjectStep,
  ScriptureRangeInput,
} from './schema.generated';

// Helper to display enums in a generic way
const displayEnum = <T extends string>() => (enumVal: Nullable<T>) =>
  startCase(enumVal ?? undefined);

export const displayStatus = displayEnum<ProjectStatus>();
export const displayProjectStep = displayEnum<ProjectStep>();
export const displayPartnershipStatus = displayEnum<
  PartnershipAgreementStatus
>();
export const displayFinancialReportingType = displayEnum<
  FinancialReportingType
>();
export const displayEngagementStatus = displayEnum<EngagementStatus>();
export const displayRole = displayEnum<Role>();
export const displayRoles = (roles: readonly Role[]) =>
  roles.map(displayRole).join(', ');

export const displayInternPosition = displayEnum<InternshipPosition>();
export const displayInternProgram = displayEnum<InternshipProgram>();
export const displayInternDomain = displayEnum<InternshipDomain>();
export const PartnershipStatuses: PartnershipAgreementStatus[] = [
  'NotAttached',
  'AwaitingSignature',
  'Signed',
];

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
