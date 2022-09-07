import { Request } from 'express';
import { createContext, useContext, useMemo } from 'react';

export const RequestContext = createContext<Request | undefined>(undefined);

export const useLocale = (): string | undefined => {
  const req = useContext(RequestContext);
  return useMemo(() => {
    if (!req) {
      return navigator.language;
    }
    try {
      const accept = req.acceptsLanguages()[0]?.replace(/_/g, '-');
      accept && new Intl.Locale(accept); // check if valid
      return accept;
    } catch {
      return undefined;
    }
  }, [req]);
};
