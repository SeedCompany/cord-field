import { SensitivityList } from '~/api/schema.graphql';
import { EnumField, SwitchField } from '../../../components/form';
import {
  BooleanParam,
  EnumListParam,
  EnumParam,
  makeQueryHandler,
  withDefault,
  withKey,
} from '../../../hooks';

export const useLanguageFilters = makeQueryHandler({
  sensitivity: EnumListParam(SensitivityList),
  leastOfThese: withKey(BooleanParam(), 'lot'),
  isSignLanguage: withKey(BooleanParam(), 'sign-language'),
  isDialect: withKey(BooleanParam(), 'dialect'),
  tab: withDefault(EnumParam(['all', 'pinned']), 'all'),
});

export const LanguageFilterOptions = () => {
  return (
    <>
      <EnumField
        name="sensitivity"
        label="Sensitivity"
        multiple
        options={SensitivityList}
        defaultOption="Show All"
        layout="two-column"
      />
      <SwitchField
        name="leastOfThese"
        label="Only Show Least Of These Partnerships"
        offIsNull
      />
      <SwitchField
        name="isSignLanguage"
        label="Only Show Sign Languages"
        offIsNull
      />
      <SwitchField name="isDialect" label="Only Show Dialects" offIsNull />
    </>
  );
};
