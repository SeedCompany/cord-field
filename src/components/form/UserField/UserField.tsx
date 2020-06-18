import { useState } from 'react';
import * as React from 'react';
import { ArrayItem } from '../../../util';
import {
  AutocompleteField,
  AutocompleteFieldProps,
} from '../AutocompleteField';
import {
  UserAutocompleteQuery,
  useUserAutocompleteLazyQuery,
} from './UserAutocomplete.generated';

type Item = ArrayItem<UserAutocompleteQuery['users']['items']>;

type UserFieldProps<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined
> = AutocompleteFieldProps<Item, Multiple, DisableClearable, false>;

export function UserField<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined
>(props: UserFieldProps<Multiple, DisableClearable>) {
  const [inputValue, setInputValue] = useState('');

  const [lookup, results] = useUserAutocompleteLazyQuery();
  const fetch = (val: string) =>
    lookup({
      variables: {
        input: {
          filter: {
            displayFirstName: val,
          },
        },
      },
    });

  return (
    <AutocompleteField
      name="user"
      {...props}
      loading={results.loading}
      getOptionLabel={(user) => user.fullName ?? ''}
      // filterOptions={(user) => Boolean(user.fullName)} // Only use users we can read
      getOptionSelected={(option, value) => option.id === value.id}
      options={results.data?.users.items ?? []}
    />
  );
}
