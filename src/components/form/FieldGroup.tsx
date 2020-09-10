import { compact } from 'lodash';
import React, { createContext, FC, useContext } from 'react';

export const FieldGroupContext = createContext('');
FieldGroupContext.displayName = 'FieldGroupContext';

export const FieldGroup: FC<{ prefix: string; replace?: boolean }> = ({
  prefix,
  children,
  replace,
}) => {
  const nested = useFieldName(prefix);
  return (
    <FieldGroupContext.Provider value={replace ? prefix : nested}>
      {children}
    </FieldGroupContext.Provider>
  );
};

export const useFieldName = (name: string) => {
  const prefix = useContext(FieldGroupContext);
  return compact([prefix, name]).join('.');
};
