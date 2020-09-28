import {
  CreatePartner,
  PartnerFormValues,
} from '../../../../scenes/Partners/Create';
import { LookupField } from '../../index';
import {
  PartnerLookupItemFragment,
  usePartnerLookupLazyQuery,
} from './PartnerLookup.generated';

export const PartnerField = LookupField.createFor<
  PartnerLookupItemFragment,
  PartnerFormValues
>({
  resource: 'Partner',
  useLookup: usePartnerLookupLazyQuery,
  label: 'Partner',
  placeholder: 'Search for an partner by name',
  getOptionLabel: (option) => option.organization.value?.name.value,
  CreateDialogForm: CreatePartner,
  //Can't pass initivalValues because it does not trigger a organization lookup on OrgField
});
