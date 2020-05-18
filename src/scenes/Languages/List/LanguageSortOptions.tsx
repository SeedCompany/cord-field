import { ComponentType } from 'react';
import * as React from 'react';
import { Language } from '../../../api';
import { SortOption, SortOptionProps } from '../../../components/Sort';

// Alias component to define generic once
const Option = SortOption as ComponentType<SortOptionProps<Language>>;

export const LanguageSortOptions = () => (
  <>
    <Option default value="name" label="Languages" asc="A-Z" desc="Z-A" />
  </>
);
