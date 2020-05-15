import React, { useState } from 'react';
import { Organization } from '../../../api';
import { SortButtonDialog, SortValue } from '../../../components/Sort';
import { OrganizationSortOptions } from './OrganizationSortOptions';

export default { title: 'Scenes/Organizations/List' };

export const SortOptions = () => {
  const [value, setValue] = useState<Partial<SortValue<Organization>>>({});

  return (
    <SortButtonDialog value={value} onChange={setValue}>
      <OrganizationSortOptions />
    </SortButtonDialog>
  );
};
