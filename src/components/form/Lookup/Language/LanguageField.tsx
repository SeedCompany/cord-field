import { LookupField } from '../../index';
import {
  LanguageLookupItemFragment as Language,
  useLanguageLookupLazyQuery,
} from './LanguageLookup.generated';

export const LanguageField = LookupField.createFor<Language>({
  resource: 'Language',
  useLookup: useLanguageLookupLazyQuery,
  label: 'Language',
  placeholder: 'Search for a language by name',
  getOptionLabel: (option) => option.name.value ?? option.displayName.value,
});
