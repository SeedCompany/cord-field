import { setContext } from '@apollo/client/link/context';
import { pickBy } from 'lodash';
import { RefObject } from 'react';
import { Impersonation } from '../ImpersonationContext';

export const createImpersonationLink = (
  ref?: RefObject<Impersonation | undefined>
) =>
  setContext((req, prev) => ({
    ...prev,
    headers: {
      ...prev.headers,
      ...pickBy({
        'x-cord-impersonate-user': ref?.current?.user,
        'x-cord-impersonate-roles': ref?.current?.roles?.join(','),
      }),
    },
  }));
