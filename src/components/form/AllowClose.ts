import { noop } from 'lodash';
import { createContext } from 'react';

/**
 * Whether to allow the form to "close".
 * This can allow fields to communicate something is in progress, that should
 * be the focus/priority over anything else.
 */
export const AllowFormCloseContext =
  createContext<(uniqueKey: string, allow: boolean) => void>(noop);
