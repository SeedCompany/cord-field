import { startCase } from 'lodash';
import {
  EngagementStatus,
  FinancialReportingType,
  PartnershipAgreementStatus,
  ProductApproach,
  ProjectStatus,
  Role,
} from '.';
import { Nullable } from '../util';
import { MethodologyToApproach } from './approach';
import {
  InternshipEngagementPosition,
  ProductMethodology,
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

export const displayInternPosition = displayEnum<
  InternshipEngagementPosition
>();
export const PartnershipStatuses: PartnershipAgreementStatus[] = [
  'NotAttached',
  'AwaitingSignature',
  'Signed',
];

export const displayMethodology = displayEnum<ProductMethodology>();
export const displayApproach = displayEnum<ProductApproach>();

export const displayMethodologyWithLabel = (methodology: ProductMethodology) =>
  `${displayApproach(
    MethodologyToApproach[methodology]
  )} - ${displayMethodology(methodology)}`;

export const displayScripture = ({ start, end }: ScriptureRangeInput) =>
  `${start.book} ${start.chapter}:${start.verse} -  ${end.chapter}:${end.verse}`;
