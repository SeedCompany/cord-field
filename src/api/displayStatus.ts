import { startCase } from 'lodash';
import { ProjectStatus } from '.';

export const displayStatus = (status: ProjectStatus) => startCase(status);
