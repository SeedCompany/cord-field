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
  getOptionLabel: (option) => option.name.value ?? '',
});

export const RegionField = LookupField.createFor<RegionLookupItem>({
  resource: 'Region',
  useLookup: useRegionLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
});

export const ZoneField = LookupField.createFor<ZoneLookupItem>({
  resource: 'Zone',
  useLookup: useZoneLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
});
