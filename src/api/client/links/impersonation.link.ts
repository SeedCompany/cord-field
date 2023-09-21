import { setContext } from '@apollo/client/link/context';
import { pickBy } from 'lodash';
import { RefObject } from 'react';
import { GqlSensitiveOperations } from '../../operationsList';
import { Impersonation } from '../ImpersonationContext';

export const createImpersonationLink = (
  ref?: RefObject<Impersonation | undefined>
) =>
  setContext((req, prev) => {
    const isSensitiveOp = req.operationName
      ? GqlSensitiveOperations.has(req.operationName)
      : false;
    const impersonation =
      ref?.current && !isSensitiveOp ? ref.current : undefined;
    return {
      ...prev,
      headers: {
        ...prev.headers,
        ...pickBy({
          'x-cord-impersonate-user': impersonation?.user,
          'x-cord-impersonate-role': impersonation?.roles?.join(','),
        }),
      },
    };
  });
