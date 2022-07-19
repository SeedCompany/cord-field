import { useState } from 'react';
import { FilterButtonDialog } from '../../../components/Filter';
import { ProjectFilterOptions } from './ProjectFilterOptions';

export default { title: 'Scenes/Projects/List' };

export const FilterOptions = () => {
  const [values, setValue] = useState({});

  return (
    <FilterButtonDialog values={values} onChange={setValue}>
      <ProjectFilterOptions />
    </FilterButtonDialog>
  );
};
