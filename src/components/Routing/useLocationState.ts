import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from './Navigate';

/**
 * Like useState but state is persisted in browser history entry.
 * Note that this represents a shared store. Using multiple instances of this
 * hook current result in them clobbering each other.
 */
export const useLocationState = <State extends Record<string, any>>(
  defaultValue: State
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultVal] = useState(() => defaultValue);
  const current = (location.state as State | null) ?? defaultVal;

  const setState = useCallback(
    (newState: State) => {
      navigate(
        {
          pathname: location.pathname,
          hash: location.hash,
          search: location.search,
        },
        {
          replace: true,
          state: newState,
        }
      );
    },
    [location, navigate]
  );

  return [current, setState] as const;
};
