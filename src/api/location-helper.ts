import { compact } from 'lodash';
import {
  DisplayCountryFragment as DisplayCountry,
  DisplayLocationFragment as DisplayLocation,
  DisplayRegionFragment as DisplayRegion,
  DisplayZoneFragment as DisplayZone,
} from '.';

export const displayLocation = (
  location: DisplayLocation | null | undefined
) => {
  const parts = location ? locationParts(location) : [];
  return compact(parts).join(', ');
};

const locationParts = (location: DisplayLocation) => {
  if (location.__typename === 'Country') {
    return countryParts(location);
  }
  if (location.__typename === 'Region') {
    return regionParts(location);
  }
  if (location.__typename === 'Zone') {
    return zoneParts(location);
  }
  return [];
};

const countryParts = (country: DisplayCountry) => [
  country.name.value,
  country.region.value?.name.value,
  country.region.value?.zone.value?.name.value,
];

const regionParts = (region: DisplayRegion) => [
  region.name,
  region.zone.value?.name.value,
];

const zoneParts = (zone: DisplayZone) => [zone.name];
