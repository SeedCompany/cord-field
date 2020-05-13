import { startCase } from 'lodash';
import { EngagementStatus, ProjectStatus } from '.';

export const displayStatus = (status: ProjectStatus) => startCase(status);

export const displayEngagementStatus = (status: EngagementStatus) =>
  startCase(status);
