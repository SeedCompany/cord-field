import { Request } from 'express';
import { createContext, useContext } from 'react';

export const RequestContext = createContext<Request | undefined>(undefined);

export const useLocale = (): string => {
  const req = useContext(RequestContext);
  return req?.acceptsLanguages()[0]?.replace('_', '-') ?? navigator.language;
};
