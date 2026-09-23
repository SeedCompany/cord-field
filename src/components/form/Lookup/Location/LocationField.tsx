import { CreateLocation as CreateLocationType } from '~/api/schema.graphql.ts';
import { DisplayLocationFragment as LocationLookupItem } from '~/common';
import { CreateLocation } from '../../../../scenes/Locations/Create';
import { LocationFormValues } from '../../../../scenes/Locations/LocationForm';
import { LookupField } from '../LookupField';
import { LocationLookupDocument } from './LocationLookup.graphql.ts';

export const LocationField = LookupField.createFor<
  LocationLookupItem,
  LocationFormValues<CreateLocationType>
>({
  resource: 'Location',
  lookupDocument: LocationLookupDocument,
  label: 'Location',
  placeholder: 'Search for a location by name',
  CreateDialogForm: CreateLocation,
  getInitialValues: (name) => ({ name }),
});
