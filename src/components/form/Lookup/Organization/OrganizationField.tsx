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
  getOptionLabel: (option) => option.name.value ?? '',
});
