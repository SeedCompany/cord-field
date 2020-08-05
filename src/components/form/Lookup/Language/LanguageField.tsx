import { LanguageLookupItem } from '.';
import { LookupField } from '../../index';
import { useLanguageLookupLazyQuery } from './LanguageLookup.generated';

export const LanguageField = LookupField.createFor<LanguageLookupItem>({
  resource: 'Language',
  useLookup: useLanguageLookupLazyQuery,
  getOptionLabel: (option) =>
    option?.name?.value ?? option?.displayName?.value ?? '',
});
