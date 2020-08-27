import { CreateLiteracyMaterialInput } from '../../../../api';
import { CreateLiteracyMaterial } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Literacy Material/CreateLiteracyMaterial';
import { LookupField } from '../../index';
import {
  LiteracyMaterialLookupItemFragment as LiteracyMaterial,
  useLiteracyMaterialLookupLazyQuery,
} from './LiteracyMaterialLookup.generated';

export const LiteracyMaterialField = LookupField.createFor<
  LiteracyMaterial,
  CreateLiteracyMaterialInput
>({
  resource: 'LiteracyMaterial',
  useLookup: useLiteracyMaterialLookupLazyQuery,
  getOptionLabel: (option) => option.name.value ?? '',
  CreateDialogForm: CreateLiteracyMaterial,
  freeSolo: true,
  getInitialValues: (value) => ({
    literacyMaterial: {
      name: value,
    },
  }),
});
