import { CreateLocation as CreateLocationType } from '../../../../api';
import {
  DisplayFieldRegionFragment as FieldRegionLookupItem,
  DisplayFieldZoneFragment as FieldZoneLookupItem,
  DisplayLocationFragment as LocationLookupItem,
} from '../../../../api/fragments/location.generated';
import { CreateLocation } from '../../../../scenes/Locations/Create';
import { LocationFormValues } from '../../../../scenes/Locations/LocationForm';
import { LookupField } from '../../index';
import {
  FieldRegionLookupDocument,
  FieldZoneLookupDocument,
  LocationLookupDocument,
} from './LocationLookup.generated';

export const LocationField = LookupField.createFor<
  LocationLookupItem,
  LocationFormValues<CreateLocationType>
>({
  resource: 'Location',
  lookupDocument: LocationLookupDocument,
  label: 'Location',
  placeholder: 'Search for a location by name',
  CreateDialogForm: CreateLocation,
  getInitialValues: (val) => ({
    location: {
      name: val,
      type: 'City',
      sensitivity: 'High',
    },
  }),
});

export const FieldRegionField = LookupField.createFor<FieldRegionLookupItem>({
  resource: 'FieldRegion',
  lookupDocument: FieldRegionLookupDocument,
  label: 'Field Region',
  getOptionLabel: (value: FieldRegionLookupItem) => value.name.value ?? '',
  placeholder: 'Search for a field region by name',
});

export const FieldZoneField = LookupField.createFor<FieldZoneLookupItem>({
  resource: 'FieldZone',
  lookupDocument: FieldZoneLookupDocument,
  label: 'Field Zone',
  placeholder: 'Search for a field zone by name',
});
