import { DisplayFieldZoneFragment as FieldZone } from '~/common';
import {
  CreateFieldZone,
  FieldZoneInput,
} from '../../../../components/FieldZone';
import { LookupField } from '../LookupField';
import { FieldZoneLookupDocument } from './FieldZoneLookup.graphql';

export const FieldZoneField = LookupField.createFor<FieldZone, FieldZoneInput>({
  resource: 'FieldZone',
  lookupDocument: FieldZoneLookupDocument,
  label: 'Field Zone',
  placeholder: 'Search for a field zone by name',
  CreateDialogForm: CreateFieldZone,
  getInitialValues: (val) => ({
    fieldZone: {
      name: val,
    },
  }),
});
