import { compact } from 'lodash';
import React, { createContext, useContext } from 'react';
import { ChildrenProp } from '~/common';

export const FieldGroupContext = createContext('');
FieldGroupContext.displayName = 'FieldGroupContext';

export const FieldGroup = ({
  prefix,
  children,
  replace,
}: { prefix: string; replace?: boolean } & ChildrenProp) => {
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
