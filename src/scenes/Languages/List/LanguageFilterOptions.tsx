import * as React from 'react';
import { SensitivityList } from '../../../api';
import { EnumField, SwitchField } from '../../../components/form';
import {
  BooleanParam,
  EnumListParam,
  makeQueryHandler,
  withKey,
} from '../../../hooks';

export const useLanguageFilters = makeQueryHandler({
  sensitivity: EnumListParam(SensitivityList),
  leastOfThese: withKey(BooleanParam(), 'lot'),
  isSignLanguage: withKey(BooleanParam(), 'sign-language'),
  isDialect: withKey(BooleanParam(), 'dialect'),
  presetInventory: withKey(BooleanParam(), 'presetInventory'),
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
      <SwitchField
        name="presetInventory"
        label="Only Show Present Inventory Languages"
        offIsNull
      />
    </>
  );
};
