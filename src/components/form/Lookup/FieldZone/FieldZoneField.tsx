import { type CreateFieldZone as CreateFieldZoneType } from '~/api/schema.graphql';
import { CreateFieldZone } from '~/scenes/FieldZones/CreateFieldZone/CreateFieldZone';
import { FieldZoneFormValues } from '~/scenes/FieldZones/FieldZoneForm/FieldZoneForm';
import { FieldZoneFormFragment } from '~/scenes/FieldZones/FieldZoneForm/FieldZoneForm.graphql';
import { LookupField } from '../LookupField';
import { FieldZoneLookupDocument } from './FieldZoneLookup.graphql';

export const FieldZoneField = LookupField.createFor<
  FieldZoneFormFragment,
  FieldZoneFormValues<CreateFieldZoneType>
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
