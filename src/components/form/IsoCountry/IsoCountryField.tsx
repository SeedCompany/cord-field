import React from 'react';
import { Except } from 'type-fest';
import {
  AutocompleteField,
  AutocompleteFieldProps,
} from '../AutocompleteField';
import {
  IsoCountryFragment as IsoCountry,
  useIsoCountriesQuery,
} from './IsoCountries.generated';

export type IsoCountryFieldProps = Except<
  AutocompleteFieldProps<IsoCountry, false, false, false>,
  'options' | 'loading'
>;

const emptyArray = [] as const;

export const IsoCountryField = (props: IsoCountryFieldProps) => {
  const { data, loading } = useIsoCountriesQuery();
  return (
    <AutocompleteField<IsoCountry, false, false, false>
      {...props}
      getCompareBy={(country) => country.alpha3}
      getOptionLabel={(country) => `${country.country} (${country.alpha3})`}
      loading={loading}
      options={data?.isoCountries ?? emptyArray}
    />
  );
};
