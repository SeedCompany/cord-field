import { LookupField } from '../../index';
import { LanguageLookupItemFragment as Language } from './LanguageLookup.graphql';
import {
  LanguageDropdownPaper,
  renderLanguageOption,
} from './LanguageFieldConfig';
import { LanguageOfReportingLookupDocument } from './LanguageOfReportingLookup.graphql';

export const LanguageOfReportingField = LookupField.createFor<Language>({
  resource: 'Language',
  lookupDocument: LanguageOfReportingLookupDocument,
  label: 'Language',
  placeholder: 'Search for a language by name',
  getOptionLabel: (option) => option.publicName ?? '',
  PaperComponent: LanguageDropdownPaper,
  renderOption: renderLanguageOption,
});
