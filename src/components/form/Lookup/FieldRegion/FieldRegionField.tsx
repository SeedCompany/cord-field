import { type CreateFieldRegion as CreateFieldRegionType } from '~/api/schema.graphql';
import { CreateFieldRegion } from '~/scenes/FieldRegions/Create/CreateFieldRegion';
import { FieldRegionFormValues } from '~/scenes/FieldRegions/FieldRegionForm/FieldRegionForm';
import { FieldRegionFormFragment } from '~/scenes/FieldRegions/FieldRegionForm/FieldRegionForm.graphql';
import { LookupField } from '../LookupField';
import { FieldRegionLookupDocument } from './FieldRegionLookup.graphql';

export const FieldRegionField = LookupField.createFor<
  FieldRegionFormFragment,
  FieldRegionFormValues<CreateFieldRegionType>
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
