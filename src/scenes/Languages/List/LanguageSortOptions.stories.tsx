import React, { useState } from 'react';
import { Language } from '../../../api';
import { SortButtonDialog, SortValue } from '../../../components/Sort';
import { LanguageSortOptions } from './LanguageSortOptions';

export default { title: 'Scenes/Languages/List' };

export const SortOptions = () => {
  const [value, setValue] = useState<Partial<SortValue<Language>>>({});

  return (
    <SortButtonDialog value={value} onChange={setValue}>
      <LanguageSortOptions />
    </SortButtonDialog>
  );
};
