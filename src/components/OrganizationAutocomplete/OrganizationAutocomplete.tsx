import React from 'react';
import { Except } from 'type-fest';
import { ArrayItem } from '../../util';
import {
  AutocompleteField,
  AutocompleteFieldProps,
  GenericUseQuery,
} from '../form';
import {
  OrganizationAutocompleteQuery,
  useOrganizationAutocompleteQuery,
} from './OrganizationAutocomplete.generated';

type OrganizationResult = ArrayItem<
  OrganizationAutocompleteQuery['organizations']['items']
>;

type OrganizationAutocompleteProps<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Except<
  AutocompleteFieldProps<
    OrganizationResult,
    Multiple,
    DisableClearable,
    FreeSolo
  >,
  'queryHook' | 'resource' | 'getOptionLabel'
>;

export function OrganizationAutocomplete<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>(props: OrganizationAutocompleteProps<Multiple, DisableClearable, FreeSolo>) {
  return (
    <AutocompleteField
      {...props}
      getOptionLabel={(option: OrganizationResult) => option.name.value || ''}
      queryHook={useOrganizationAutocompleteQuery as GenericUseQuery}
      resource="organizations"
      chipLabelShape="name.value"
    />
  );
}
