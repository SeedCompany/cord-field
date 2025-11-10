import { CreateFieldRegion } from '../../../FieldRegion';
import { LookupField } from '../LookupField';
import { FieldRegionLookupDocument } from './FieldRegionLookup.graphql';
import { InitialFieldRegionOptionsDocument as InitialFieldRegions } from './InitialFieldRegionOptions.graphql';

export const FieldRegionField = LookupField.createFor({
  resource: 'FieldRegion',
  initial: [InitialFieldRegions, ({ fieldRegions }) => fieldRegions.items],
  lookupDocument: FieldRegionLookupDocument,
  label: 'Field Region',
  placeholder: 'Search for a field region by name',
  CreateDialogForm: CreateFieldRegion,
  // @ts-expect-error don't need to pass through entire initialValues
  getInitialValues: (val) => ({
    fieldRegion: {
      name: val,
    },
  }),
});
