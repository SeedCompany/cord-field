import { CreateLanguage as CreateLanguageType } from '~/api/schema.graphql';
import { CreateLanguage } from '../../../../scenes/Languages/Create';
import { LanguageFormValues } from '../../../../scenes/Languages/LanguageForm';
import { LookupField } from '../../index';
import {
  LanguageLookupItemFragment as Language,
  LanguageLookupDocument,
} from './LanguageLookup.graphql';
import {
  LanguageDropdownPaper,
  renderLanguageOption,
} from './LanguageFieldConfig';

export const LanguageField = LookupField.createFor<
  Language,
  LanguageFormValues<CreateLanguageType>
>({
  resource: 'Language',
  lookupDocument: LanguageLookupDocument,
  label: 'Language',
  placeholder: 'Search for a language by name',
  getOptionLabel: (option) => option.publicName ?? '',
  CreateDialogForm: CreateLanguage,
  getInitialValues: (name) => ({ name, displayName: name }),
  PaperComponent: LanguageDropdownPaper,
  renderOption: (props, option) =>
    typeof option === 'string' ? (
      <li {...props}>{`Create "${option}"`}</li>
    ) : (
      renderLanguageOption(props, option)
    ),
});
