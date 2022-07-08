import { ComponentType } from 'react';
import * as React from 'react';
import { User } from '~/api/schema.graphql';
import { SortOption, SortOptionProps } from '../../../components/Sort';

// Alias component to define generic once
const Option = SortOption as ComponentType<SortOptionProps<User>>;

export const UserSortOptions = () => (
  <>
    <Option
      default
      value="displayFirstName"
      label="First Name"
      asc="A-Z"
      desc="Z-A"
      defaultOrder="ASC"
    />
    <Option
      value="displayLastName"
      label="Last Name"
      asc="A-Z"
      desc="Z-A"
      defaultOrder="ASC"
    />
  </>
);
