import { DisplayFieldRegionFragment as FieldRegion } from '~/common';
import { CreateFieldRegion, FieldRegionInput } from '../../../FieldRegion';
import { LookupField } from '../LookupField';
import { FieldRegionLookupDocument } from './FieldRegionLookup.graphql';

export const FieldRegionField = LookupField.createFor<
  FieldRegion,
  FieldRegionInput
>({
  resource: 'FieldRegion',
  lookupDocument: FieldRegionLookupDocument,
  label: 'Field Region',
  placeholder: 'Search for a field region by name',
  CreateDialogForm: CreateFieldRegion,
  getInitialValues: (val) => ({
    fieldRegion: {
      name: val,
    },
  }),
});
