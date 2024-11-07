import { GridEventListener } from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';
import { useDebounceFn, usePrevious, useSessionStorageState } from 'ahooks';
import { isEqual } from 'lodash';
import { useEffect } from 'react';

interface UsePersistedGridStateOptions {
  key: string;
  apiRef: any;
  defaultValue: GridInitialStatePro;
}

export const usePersistedGridState = ({
  key,
  apiRef,
  defaultValue,
}: UsePersistedGridStateOptions) => {
  const [savedGridState, setSavedGridState] = useSessionStorageState(key, {
    defaultValue,
  });

  const prevGridState = usePrevious(
    savedGridState,
    (prev, next) => !isEqual(prev, next)
  );

  const { run: handleStateChange } = useDebounceFn(
    () => {
      const gridState = apiRef.current?.exportState();
      setSavedGridState((prev) => {
        return isEqual(prev, gridState) ? prev : gridState;
      });
    },
    { wait: 500, maxWait: 500 }
  );

  const onStateChange: GridEventListener<'stateChange'> = () => {
    handleStateChange();
  };

  useEffect(() => {
    if (savedGridState && !isEqual(savedGridState, prevGridState)) {
      apiRef.current?.restoreState(savedGridState);
    }
  }, [savedGridState, apiRef, prevGridState]);

  return [savedGridState, onStateChange] as const;
};
