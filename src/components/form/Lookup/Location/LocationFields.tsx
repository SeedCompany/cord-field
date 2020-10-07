import {
  DisplayFieldRegionFragment as FieldRegionLookupItem,
  DisplayFieldZoneFragment as FieldZoneLookupItem,
  DisplayLocationFragment as LocationLookupItem,
} from '../../../../api/fragments/location.generated';
import { LookupField } from '../../index';
import {
  useFieldRegionLookupLazyQuery,
  useFieldZoneLookupLazyQuery,
  useLocationLookupLazyQuery,
} from './LocationLookup.generated';

export const LocationField = LookupField.createFor<LocationLookupItem>({
  resource: 'Location',
  useLookup: useLocationLookupLazyQuery,
  label: 'Location',
  placeholder: 'Search for a location by name',
});

export const FieldRegionField = LookupField.createFor<FieldRegionLookupItem>({
  resource: 'FieldRegion',
  useLookup: useFieldRegionLookupLazyQuery,
  label: 'FieldRegion',
  placeholder: 'Search for a location by name',
});

export const FieldZoneField = LookupField.createFor<FieldZoneLookupItem>({
  resource: 'FieldZone',
  useLookup: useFieldZoneLookupLazyQuery,
  label: 'FieldZone',
  placeholder: 'Search for a location by name',
});
