import { LookupField } from '../../index';
import {
  PartnerLookupItemFragment,
  usePartnerLookupLazyQuery,
} from './PartnerLookup.generated';

export const PartnerField = LookupField.createFor<PartnerLookupItemFragment>({
  resource: 'Partner',
  useLookup: usePartnerLookupLazyQuery,
  label: 'Partner',
  placeholder: 'Search for an partner by name',
  getOptionLabel: (option) => option.organization.value?.name.value,
});
