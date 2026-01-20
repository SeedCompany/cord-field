import { CreateFieldZone } from '../../../FieldZone';
import { LookupField } from '../LookupField';
import { FieldZoneLookupDocument } from './FieldZoneLookup.graphql';
import { InitialFieldZoneOptionsDocument as InitialFieldZones } from './InitialFieldZoneOptions.graphql';

export const FieldZoneField = LookupField.createFor({
  resource: 'FieldZone',
  initial: [InitialFieldZones, ({ fieldZones }) => fieldZones.items],
  lookupDocument: FieldZoneLookupDocument,
  label: 'Field Zone',
  placeholder: 'Search for a field zone by name',
  CreateDialogForm: CreateFieldZone,
  getInitialValues: (name) => ({ name }),
});
