import { CreateOrganizationInput } from '../../../../api';
import { CreateOrganization } from '../../../../scenes/Organizations/Create';
import { LookupField } from '../../index';
import {
  OrganizationLookupItemFragment,
  useOrganizationLookupLazyQuery,
} from './OrganizationLookup.generated';

export const OrganizationField = LookupField.createFor<
  OrganizationLookupItemFragment,
  CreateOrganizationInput
>({
  resource: 'Organization',
  useLookup: useOrganizationLookupLazyQuery,
  label: 'Organization',
  placeholder: 'Search for an organization by name',
  CreateDialogForm: CreateOrganization,
  getInitialValues: (val): Partial<CreateOrganizationInput> => ({
    organization: {
      name: val,
    },
  }),
});
