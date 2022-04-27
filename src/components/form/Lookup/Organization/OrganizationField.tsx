import { CreateOrganizationInput } from '../../../../api';
import { CreateOrganization } from '../../../../scenes/Organizations/Create';
import { LookupField } from '../../index';
import {
  OrganizationLookupDocument,
  OrganizationLookupItemFragment,
} from './OrganizationLookup.graphql';

export const OrganizationField = LookupField.createFor<
  OrganizationLookupItemFragment,
  CreateOrganizationInput
>({
  resource: 'Organization',
  lookupDocument: OrganizationLookupDocument,
  label: 'Organization',
  placeholder: 'Search for an organization by name',
  CreateDialogForm: CreateOrganization,
  getInitialValues: (val): Partial<CreateOrganizationInput> => ({
    organization: {
      name: val,
    },
  }),
});
