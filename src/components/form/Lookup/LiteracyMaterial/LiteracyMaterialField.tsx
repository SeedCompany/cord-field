import { CreateLiteracyMaterialInput } from '../../../../api';
import { CreateLiteracyMaterial } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Literacy Material/CreateLiteracyMaterial';
import { LookupField } from '../../index';
import {
  LiteracyMaterialLookupItemFragment as LiteracyMaterial,
  LiteracyMaterialLookupDocument,
} from './LiteracyMaterialLookup.generated';

export const LiteracyMaterialField = LookupField.createFor<
  LiteracyMaterial,
  CreateLiteracyMaterialInput
>({
  resource: 'LiteracyMaterial',
  lookupDocument: LiteracyMaterialLookupDocument,
  label: 'Literacy Material',
  placeholder: 'Search for a literacy material by name',
  CreateDialogForm: CreateLiteracyMaterial,
  getInitialValues: (value) => ({
    literacyMaterial: {
      name: value,
    },
  }),
});
