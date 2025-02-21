import { DisplayFieldRegionFragment as FieldRegion } from '~/common';
import { CreateFieldRegion, FieldRegionFormValues } from '../../../FieldRegion';
import { LookupField } from '../LookupField';
import { FieldRegionLookupDocument } from './FieldRegionLookup.graphql';

export const FieldRegionField = LookupField.createFor<
  FieldRegion,
  FieldRegionFormValues
>({
  resource: 'FieldRegion',
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
