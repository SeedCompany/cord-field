import { Request } from 'express';
import { createContext, useContext } from 'react';

export const RequestContext = createContext<Request | undefined>(undefined);

export const useLocale = (): string => {
  const req = useContext(RequestContext);
  const locale = req?.acceptsLanguages()[0] ?? navigator.language;
  return locale.replace(/_/g, '-');
};
