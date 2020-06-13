import { startCase } from 'lodash';
import { SecuredRoles } from './schema.generated';

export const displayRoles = (
  securedRoles: Partial<SecuredRoles> | undefined | null
) =>
  securedRoles?.canRead && securedRoles?.value
    ? securedRoles.value.map((role) => startCase(role)).join(', ')
    : '';
