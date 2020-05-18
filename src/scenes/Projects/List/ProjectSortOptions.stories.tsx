import React, { useState } from 'react';
import { Project } from '../../../api';
import { SortButtonDialog, SortValue } from '../../../components/Sort';
import { ProjectSortOptions } from './ProjectSortOptions';

export default { title: 'Scenes/Projects/List' };

export const SortOptions = () => {
  const [value, setValue] = useState<Partial<SortValue<Project>>>({});

  return (
    <SortButtonDialog value={value} onChange={setValue}>
      <ProjectSortOptions />
    </SortButtonDialog>
  );
};
