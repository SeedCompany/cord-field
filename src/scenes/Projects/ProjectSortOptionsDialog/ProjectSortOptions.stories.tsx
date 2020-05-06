import React, { useState } from 'react';
import { ProjectSortOptions as ProjectSortOptionsComponent } from './ProjectSortOptions';

export default { title: 'Components/ProjectSortOptions' };

export const ProjectSortOptions = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <ProjectSortOptionsComponent
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
