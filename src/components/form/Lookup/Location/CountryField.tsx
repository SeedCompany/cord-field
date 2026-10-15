import { DisplayLocationFragment as CountryLookupItem } from '~/common';
import { LookupField } from '../LookupField';
import { CountryLookupDocument } from './CountryLookup.graphql';
import {
  InitialCountryOptionsDocument as InitialCountries,
  InitialCountryOptionsQuery,
} from './InitialCountryOptions.graphql';

/**
 * A Location lookup constrained to `Country`.
 *
 * Country-labeled fields used {@link LocationField}, which searches every
 * location type — so "Country of Origin" would happily accept a city.
 * Filtering to `[Country]` means both the search and the prepopulated list
 * only ever offer countries.
 */
export const CountryField = LookupField.createFor<
  CountryLookupItem,
  never,
  InitialCountryOptionsQuery
>({
  resource: 'Location',
  initial: [InitialCountries, ({ locations }) => locations.items],
  lookupDocument: CountryLookupDocument,
  label: 'Country',
  placeholder: 'Search for a country',
});
