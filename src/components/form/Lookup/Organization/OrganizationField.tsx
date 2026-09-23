import { CreateOrganization as CreateOrganizationInput } from '~/api/schema.graphql.ts';
import { CreateOrganization } from '../../../../scenes/Organizations/Create';
import { LookupField } from '../../index';
import {
  OrganizationLookupDocument,
  OrganizationLookupItemFragment,
} from './OrganizationLookup.graphql.ts';

export const OrganizationField = LookupField.createFor<
  OrganizationLookupItemFragment,
  CreateOrganizationInput
>({
  resource: 'Organization',
  lookupDocument: OrganizationLookupDocument,
  label: 'Organization',
  placeholder: 'Search for an organization by name',
  CreateDialogForm: CreateOrganization,
  getInitialValues: (name) => ({ name }),
});
