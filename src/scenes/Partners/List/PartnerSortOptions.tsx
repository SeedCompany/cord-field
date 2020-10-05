import { ComponentType } from 'react';
import * as React from 'react';
import { Partner } from '../../../api';
import { SortOption, SortOptionProps } from '../../../components/Sort';

// Alias component to define generic once
const Option = SortOption as ComponentType<
  SortOptionProps<
    Partner & { name: string } // TODO how to sort across child relations
  >
>;

export const PartnerSortOptions = () => (
  <>
    <Option default value="name" label="Name" asc="A-Z" desc="Z-A" />
  </>
);
