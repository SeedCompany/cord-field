import { CreateLocation as CreateLocationType } from '~/api/schema.graphql';
import {
  DisplayFieldRegionFragment as FieldRegionLookupItem,
  DisplayFieldZoneFragment as FieldZoneLookupItem,
  DisplayLocationFragment as LocationLookupItem,
} from '~/common';
import { CreateLocation } from '../../../../scenes/Locations/Create';
import { LocationFormValues } from '../../../../scenes/Locations/LocationForm';
import { LookupField } from '../../Lookup/LookupField';
import {
  FieldRegionLookupDocument,
  FieldZoneLookupDocument,
  LocationLookupDocument,
} from './LocationLookup.graphql';

export const LocationField = LookupField.createFor<
  LocationLookupItem,
  LocationFormValues<CreateLocationType>
>({
  resource: 'Location',
  lookupDocument: LocationLookupDocument,
  label: 'Location',
  placeholder: 'Search for a location by name',
  CreateDialogForm: CreateLocation,
  // @ts-expect-error don't need to pass through entire initialValues
  getInitialValues: (val) => ({
    location: {
      name: val,
    },
  }),
});

export const FieldRegionField = LookupField.createFor<FieldRegionLookupItem>({
  resource: 'FieldRegion',
  lookupDocument: FieldRegionLookupDocument,
  label: 'Field Region',
  placeholder: 'Search for a field region by name',
});

export const FieldZoneField = LookupField.createFor<FieldZoneLookupItem>({
  resource: 'FieldZone',
  lookupDocument: FieldZoneLookupDocument,
  label: 'Field Zone',
  placeholder: 'Search for a field zone by name',
});

export const MarketingField = LookupField.createFor<LocationLookupItem>({
  resource: 'Location',
  lookupDocument: LocationLookupDocument,
  label: 'Marketing Location',
  placeholder: 'Search for a location by name',
});
