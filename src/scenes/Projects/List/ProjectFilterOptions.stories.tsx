import React, { useState } from 'react';
import { FilterButtonDialog } from '../../../components/Filter';
import {
  ProjectFilterOptions,
  ProjectFilterValues,
} from './ProjectFilterOptions';

export default { title: 'Scenes/Projects/List' };

export const FilterOptions = () => {
  const [values, setValue] = useState<Partial<ProjectFilterValues>>({});

  return (
    <FilterButtonDialog values={values} onChange={setValue}>
      <ProjectFilterOptions />
    </FilterButtonDialog>
  );
};
