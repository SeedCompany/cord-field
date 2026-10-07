import { CreateLocation as CreateLocationType } from '~/api/schema.graphql';
import { DisplayLocationFragment as LocationLookupItem } from '~/common';
import { CreateLocation } from '../../../../scenes/Locations/Create';
import { LocationFormValues } from '../../../../scenes/Locations/LocationForm';
import { LookupField } from '../LookupField';
import {
  InitialLocationOptionsQuery,
  InitialLocationOptionsDocument as InitialLocations,
} from './InitialLocationOptions.graphql';
import { LocationLookupDocument } from './LocationLookup.graphql';

export const LocationField = LookupField.createFor<
  LocationLookupItem,
  LocationFormValues<CreateLocationType>,
  InitialLocationOptionsQuery
>({
  resource: 'Location',
  initial: [InitialLocations, ({ locations }) => locations.items],
  lookupDocument: LocationLookupDocument,
  label: 'Location',
  placeholder: 'Search for a location by name',
  CreateDialogForm: CreateLocation,
  getInitialValues: (name) => ({ name }),
});
