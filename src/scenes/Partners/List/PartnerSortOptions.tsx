import { ComponentType } from 'react';
import * as React from 'react';
import { Partner } from '~/api/schema.graphql';
import { SortOption, SortOptionProps } from '../../../components/Sort';

export type PartnerSort = Partner & { name: string }; // TODO how to sort across child relations

// Alias component to define generic once
const Option = SortOption as ComponentType<SortOptionProps<PartnerSort>>;

export const PartnerSortOptions = () => (
  <>
    <Option default value="name" label="Name" asc="A-Z" desc="Z-A" />
  </>
);
