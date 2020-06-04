import * as React from 'react';
import { AutocompleteField } from '../AutocompleteField';
import { useUserAutocompleteLazyQuery } from './UserAutocomplete.generated';

export const UserField = (props: any) => {
  const [lookup, results] = useUserAutocompleteLazyQuery();

  return (
    <AutocompleteField<>
      name="user"
      {...props}
      loading={results.loading}
      getOptionLabel={user => user.}
      options={results.data?.users.items}
    />
  );
};
