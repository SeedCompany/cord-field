import { CreateLanguage as CreateLanguageType } from '~/api/schema.graphql';
import { CreateLanguage } from '../../../../scenes/Languages/Create';
import { LanguageFormValues } from '../../../../scenes/Languages/LanguageForm';
import { LookupField } from '../../index';
import {
  LanguageLookupItemFragment as Language,
  LanguageLookupDocument,
} from './LanguageLookup.graphql';

export const LanguageField = LookupField.createFor<
  Language,
  LanguageFormValues<CreateLanguageType>
>({
  resource: 'Language',
  lookupDocument: LanguageLookupDocument,
  label: 'Language',
  placeholder: 'Search for a language by name',
  getOptionLabel: (option) => option.name.value ?? option.displayName.value,
  CreateDialogForm: CreateLanguage,
  getInitialValues: (name) => ({ name, displayName: name }),
});
