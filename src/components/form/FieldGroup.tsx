import { compact } from 'lodash';
import React, { createContext, FC, useContext } from 'react';

export const FieldGroupContext = createContext('');
FieldGroupContext.displayName = 'FieldGroupContext';

export const FieldGroup: FC<{ prefix: string }> = ({ prefix, children }) => (
  <FieldGroupContext.Provider value={useFieldName(prefix)}>
    {children}
  </FieldGroupContext.Provider>
);

export const useFieldName = (name: string) => {
  const prefix = useContext(FieldGroupContext);
  return compact([prefix, name]).join('.');
};
