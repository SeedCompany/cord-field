import {
  DisplayCountryFragment as CountryLookupItem,
  DisplayRegionFragment as RegionLookupItem,
  DisplayZoneFragment as ZoneLookupItem,
} from '../../../../api/fragments/location.generated';
import { LookupField } from '../../index';
import {
  useCountryLookupLazyQuery,
  useRegionLookupLazyQuery,
  useZoneLookupLazyQuery,
} from './LocationLookup.generated';

export const CountryField = LookupField.createFor<CountryLookupItem>({
  resource: 'Country',
  useLookup: useCountryLookupLazyQuery,
  label: 'Country',
  placeholder: 'Search for a country by name',
});

export const RegionField = LookupField.createFor<RegionLookupItem>({
  resource: 'Region',
  useLookup: useRegionLookupLazyQuery,
  label: 'Region',
  placeholder: 'Search for a region by name',
});

export const ZoneField = LookupField.createFor<ZoneLookupItem>({
  resource: 'Zone',
  useLookup: useZoneLookupLazyQuery,
  label: 'Zone',
  placeholder: 'Search for a zone by name',
});
