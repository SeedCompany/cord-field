import * as React from 'react';
import { SensitivityList } from '../../../api';
import { EnumField, SwitchField } from '../../../components/form';
import {
  BooleanParam,
  EnumListParam,
  makeQueryHandler,
  withDefault,
  withKey,
} from '../../../hooks';

export const useLanguageFilters = makeQueryHandler({
  sensitivity: EnumListParam(SensitivityList),
  leastOfThese: withKey(withDefault(BooleanParam(), false), 'lot'),
  isSignLanguage: withKey(withDefault(BooleanParam(), false), 'sign-language'),
  isDialect: withKey(withDefault(BooleanParam(), false), 'dialect'),
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
      />
      <SwitchField name="isSignLanguage" label="Only Show Sign Languages" />
      <SwitchField name="isDialect" label="Only Show Dialects" />
    </>
  );
};
