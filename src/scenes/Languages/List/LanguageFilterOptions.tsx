import { upperFirst } from 'lodash';
import * as React from 'react';
import { Sensitivity, SensitivityList } from '../../../api';
import { EnumField, SwitchField } from '../../../components/form';
import {
  BooleanParam,
  EnumListParam,
  makeQueryHandler,
  withDefault,
  withKey,
  withTransform,
} from '../../../hooks';

export const useLanguageFilters = makeQueryHandler({
  sensitivity: withTransform(EnumListParam<Sensitivity>(), {
    encode: (value, encoder) =>
      encoder(value?.map((v: Sensitivity) => v.toLowerCase())),
    decode: (value, decoder) =>
      decoder(value)?.map((v) => upperFirst(v) as Sensitivity),
  }),
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
