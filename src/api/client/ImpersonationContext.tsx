import { Many, many } from '@seedcompany/common';
import { useLatest } from 'ahooks';
import Cookies from 'js-cookie';
import { noop, pickBy } from 'lodash';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  const [broadcast] = useState(() =>
    typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel('impersonation')
      : undefined
  );
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
      broadcast?.postMessage(next);
      if (!next) {
        Cookies.remove('impersonation');
        return;
      }
      Cookies.set('impersonation', JSON.stringify(next), {
        secure: true,
        sameSite: 'strict',
      });
    },
    [setImpersonation, broadcast]
  );
  const value = useMemo(
    () => ({
      ...impersonation,
      enabled: Boolean(impersonation?.user || impersonation?.roles),
      set,
    }),
    [impersonation, set]
  );

  useEffect(() => {
    if (!broadcast) {
      return;
    }
    const listener = (event: MessageEvent) => {
      setImpersonation(event.data);
    };
    broadcast.addEventListener('message', listener);
    return () => {
      broadcast.removeEventListener('message', listener);
      broadcast.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose devtools API
  const latest = useLatest(value);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    Object.defineProperty(window, 'impersonation', {
      writable: true,
      configurable: true,
      value: {
        get user() {
          return latest.current.user;
        },
        set user(value) {
          latest.current.set({ user: value });
        },
        get roles() {
          return latest.current.roles;
        },
        set roles(value: Many<Role> | undefined) {
          latest.current.set({ roles: value ? many(value) : undefined });
        },
        clear() {
          latest.current.set();
        },
      },
    });
  }, [latest]);

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
