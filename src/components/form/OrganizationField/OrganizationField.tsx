import { useState } from 'react';
import * as React from 'react';
import { ArrayItem } from '../../../util';
import {
  AutocompleteField,
  AutocompleteFieldProps,
} from '../AutocompleteField';
import {
  OrganizationAutocompleteQuery,
  useOrganizationAutocompleteLazyQuery,
} from './OrganizationAutocomplete.generated';

type Item = ArrayItem<OrganizationAutocompleteQuery['organizations']['items']>;

type OrganizationFieldProps<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined
> = AutocompleteFieldProps<Item, Multiple, DisableClearable, false>;

export function OrganizationField<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined
>(props: OrganizationFieldProps<Multiple, DisableClearable>) {
  const [inputValue, setInputValue] = useState('');

  const [lookup, results] = useOrganizationAutocompleteLazyQuery();
  const fetch = (val: string) =>
    lookup({
      variables: {
        input: {
          filter: {
            name: val,
          },
        },
      },
    });

  return (
    <AutocompleteField
      name="user"
      {...props}
      loading={results.loading}
      getOptionLabel={(org) => org.name.value ?? ''}
      // filterOptions={(user) => Boolean(user.fullName)} // Only use users we can read
      getOptionSelected={(option, value) => option.id === value.id}
      options={results.data?.organizations.items ?? []}
    />
  );
}
