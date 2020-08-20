import { LiteracyMaterialLookupItem } from '.';
import { CreateLiteracyMaterialInput } from '../../../../api';
import { CreateLiteracyMaterial } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/Literacy Material/CreateLiteracyMaterial';
import { LookupField } from '../../index';
import { useLiteracyMaterialLookupLazyQuery } from './LiteracyMaterialLookup.generated';

export const LiteracyMaterialField = LookupField.createFor<
  LiteracyMaterialLookupItem,
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
