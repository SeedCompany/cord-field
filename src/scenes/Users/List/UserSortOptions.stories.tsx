import React, { useState } from 'react';
import { User } from '../../../api';
import { SortButtonDialog, SortValue } from '../../../components/Sort';
import { UserSortOptions } from './UserSortOptions';

export default { title: 'Scenes/User/List' };

export const SortOptions = () => {
  const [value, setValue] = useState<Partial<SortValue<User>>>({});

  return (
    <SortButtonDialog value={value} onChange={setValue}>
      <UserSortOptions />
    </SortButtonDialog>
  );
};
