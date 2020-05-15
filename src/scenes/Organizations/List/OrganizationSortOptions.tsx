import { ComponentType } from 'react';
import * as React from 'react';
import { Organization } from '../../../api';
import { SortOption, SortOptionProps } from '../../../components/Sort';

// Alias component to define generic once
const Option = SortOption as ComponentType<SortOptionProps<Organization>>;

export const OrganizationSortOptions = () => (
  <>
    <Option default value="name" label="Organizations" asc="A-Z" desc="Z-A" />
  </>
);
