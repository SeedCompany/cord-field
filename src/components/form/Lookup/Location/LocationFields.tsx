import { DisplayLocationFragment as LocationLookupItem } from '../../../../api/fragments/location.generated';
import { LookupField } from '../../index';
import { useLocationLookupLazyQuery } from './LocationLookup.generated';

export const LocationField = LookupField.createFor<LocationLookupItem>({
  resource: 'Location',
  useLookup: useLocationLookupLazyQuery,
  label: 'Location',
  placeholder: 'Search for a location by name',
});
