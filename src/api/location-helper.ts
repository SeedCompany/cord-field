import { Country } from '.';

export const displayLocation = (location: Country) => {
  if (location) {
    const countryName = location.name.value;
    const regionName = location.region.value?.name.value;
    const classify = countryName && regionName ? ', ' : '';
    return `${countryName}${classify}${regionName}`;
  }
  return;
};
