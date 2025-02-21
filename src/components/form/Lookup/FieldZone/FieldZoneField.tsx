import { DisplayFieldZoneFragment as FieldZone } from '~/common';
import {
  CreateFieldZone,
  FieldZoneFormValues,
} from '../../../../components/FieldZone';
import { LookupField } from '../LookupField';
import { FieldZoneLookupDocument } from './FieldZoneLookup.graphql';

export const FieldZoneField = LookupField.createFor<
  FieldZone,
  FieldZoneFormValues
>({
  resource: 'FieldZone',
  lookupDocument: FieldZoneLookupDocument,
  label: 'Field Zone',
  placeholder: 'Search for a field zone by name',
  CreateDialogForm: CreateFieldZone,
  // @ts-expect-error don't need to pass through entire initialValues
  getInitialValues: (val) => ({
    fieldZone: {
      name: val,
    },
  }),
});
