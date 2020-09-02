import { LookupField } from '../../index';
import {
  OrganizationLookupItemFragment,
  useOrganizationLookupLazyQuery,
} from './OrganizationLookup.generated';

export const OrganizationField = LookupField.createFor<
  OrganizationLookupItemFragment
>({
  resource: 'Organization',
  useLookup: useOrganizationLookupLazyQuery,
  label: 'Organization',
  placeholder: 'Search for an organization by name',
});
