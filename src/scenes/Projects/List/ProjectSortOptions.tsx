import { ComponentType } from 'react';
import * as React from 'react';
import { Project } from '../../../api';
import { SortOption, SortOptionProps } from '../../../components/Sort';

// Alias component to define generic once
const Option = SortOption as ComponentType<SortOptionProps<Project>>;

export const ProjectSortOptions = () => (
  <>
    <Option default value="name" label="Projects" asc="A-Z" desc="Z-A" />
    <Option
      value="sensitivity"
      label="Sensitivity"
      asc="Low to High"
      desc="High to Low"
      defaultOrder="DESC"
    />
    <Option
      value="estimatedSubmission"
      label="Estimated Submission Date"
      asc="Furthest Date to Closest"
      desc="Closest Date to Furthest"
      defaultOrder="DESC"
    />
  </>
);
