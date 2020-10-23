import { LookupField } from '../../index';
import {
  LanguageLookupItemFragment as Language,
  LanguageLookupDocument,
} from './LanguageLookup.generated';

export const LanguageField = LookupField.createFor<Language>({
  resource: 'Language',
  lookupDocument: LanguageLookupDocument,
  label: 'Language',
  placeholder: 'Search for a language by name',
  getOptionLabel: (option) => option.name.value ?? option.displayName.value,
});
