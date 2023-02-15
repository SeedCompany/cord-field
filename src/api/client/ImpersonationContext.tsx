import Cookies from 'js-cookie';
import { noop, pickBy } from 'lodash';
import { createContext, useCallback, useMemo, useState } from 'react';
import { ChildrenProp } from '~/common';
import { Role } from '../schema/schema.graphql';

export interface Impersonation {
  readonly user?: string;
  readonly roles?: readonly Role[];
}

export const ImpersonationContext = createContext<
  Impersonation & {
    readonly enabled: boolean;
    readonly set: (next?: Impersonation) => void;
  }
>({ enabled: false, set: noop });

export const ImpersonationProvider = ({
  children,
  initial,
}: ChildrenProp & { initial?: Impersonation | null }) => {
  const [impersonation, setImpersonation] = useState(() => {
    if (initial !== undefined) {
      return initial ?? undefined;
    }
    return impersonationFromCookie(Cookies.get()) ?? undefined;
  });
  const set = useCallback(
    (next?: Impersonation) => {
      next = next
        ? pickBy(next, (val) => (Array.isArray(val) ? val.length > 0 : !!val))
        : undefined;
      next = next && Object.keys(next).length === 0 ? undefined : next;
      setImpersonation(next);
      if (!next) {
        Cookies.remove('impersonation');
        return;
      }
      Cookies.set('impersonation', JSON.stringify(next), {
        secure: true,
        sameSite: 'strict',
      });
    },
    [setImpersonation]
  );
  const value = useMemo(
    () => ({
      ...impersonation,
      enabled: Boolean(impersonation?.user || impersonation?.roles),
      set,
    }),
    [impersonation, set]
  );

  return (
    <ImpersonationContext.Provider value={value}>
      {children}
    </ImpersonationContext.Provider>
  );
};

export const impersonationFromCookie = (
  jar: Record<string, string | undefined>
) => {
  return tryJsonParse<Impersonation>(jar.impersonation) ?? null;
};

const tryJsonParse = <T,>(str: string | undefined): T | undefined => {
  if (!str) {
    return undefined;
  }
  try {
    return JSON.parse(str);
  } catch {
    return undefined;
  }
};
