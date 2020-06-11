import { startCase } from 'lodash';
import { EngagementStatus, PartnershipAgreementStatus, ProjectStatus } from '.';

export const displayStatus = (status: ProjectStatus) => startCase(status);

export const displayPartnershipStatus = (status: PartnershipAgreementStatus) =>
  startCase(status);

export const displayEngagementStatus = (status: EngagementStatus) =>
  startCase(status);
