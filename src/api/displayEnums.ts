import { startCase } from 'lodash';
import {
  EngagementStatus,
  PartnershipAgreementStatus,
  ProjectStatus,
  Role,
} from '.';
import { Nullable } from '../util';
import { InternshipEngagementPosition } from './schema.generated';

// Helper to display enums in a generic way
const displayEnum = <T extends string>() => (enumVal: Nullable<T>) =>
  startCase(enumVal ?? undefined);

export const displayStatus = displayEnum<ProjectStatus>();
export const displayPartnershipStatus = displayEnum<
  PartnershipAgreementStatus
>();
export const displayEngagementStatus = displayEnum<EngagementStatus>();
export const displayRole = displayEnum<Role>();
export const displayRoles = (roles: Role[]) =>
  roles.map(displayRole).join(', ');

export const displayInternPosition = displayEnum<
  InternshipEngagementPosition
>();
export const PartnershipStatuses: PartnershipAgreementStatus[] = [
  'NotAttached',
  'AwaitingSignature',
  'Signed',
];
