import { DisplayFieldZoneFragment as FieldZoneLookupItem } from '~/common';
import { LookupField } from '../LookupField';
import { FieldZoneLookupDocument } from './FieldZoneLookup.graphql';

export const FieldZoneField = LookupField.createFor<FieldZoneLookupItem>({
  resource: 'FieldZone',
  lookupDocument: FieldZoneLookupDocument,
  label: 'Field Zone',
  placeholder: 'Search for a field zone by name',
});
