import { LookupField } from '../../index';
import {
  LanguageLookupItemFragment as Language,
  useLanguageLookupLazyQuery,
} from './LanguageLookup.generated';

export const LanguageField = LookupField.createFor<Language>({
  resource: 'Language',
  useLookup: useLanguageLookupLazyQuery,
  getOptionLabel: (option) =>
    option.name.value ?? option.displayName.value ?? '',
});
