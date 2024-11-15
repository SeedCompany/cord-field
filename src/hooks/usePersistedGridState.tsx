import { GridApiPro, GridEventListener } from '@mui/x-data-grid-pro';
import { GridInitialStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';
import { useDebounceFn, usePrevious, useSessionStorageState } from 'ahooks';
import { isEqual } from 'lodash';
import { MutableRefObject, useEffect, useRef } from 'react';
import { convertMuiFiltersToApi } from '~/components/Grid/convertMuiFiltersToApi';

interface UsePersistedGridStateOptions {
  key: string;
  apiRef: MutableRefObject<GridApiPro>;
  defaultValue: GridInitialStatePro;
}

export const usePersistedGridState = ({
  key,
  apiRef,
  defaultValue,
}: UsePersistedGridStateOptions) => {
  const isRestoringState = useRef(true);

  const [savedGridState, setSavedGridState] = useSessionStorageState(key, {
    defaultValue,
  });

  const [persistedFilterModel, setPersistedFilterModel] =
    useSessionStorageState<Record<string, any>>(`${key}-api-filter`, {});

  const prevGridState = usePrevious(
    savedGridState,
    (prev, next) => !isEqual(prev, next)
  );

  const { run: handleStateChange } = useDebounceFn(
    () => {
      const gridState = apiRef.current.exportState();

      setPersistedFilterModel((prev) =>
        isEqual(prev, gridState)
          ? prev
          : convertMuiFiltersToApi(
              apiRef.current,
              gridState.filter?.filterModel
            )
      );
      setSavedGridState((prev) =>
        isEqual(prev, gridState) ? prev || defaultValue : gridState
      );
    },
    { wait: 500, maxWait: 500 }
  );

  const onStateChange: GridEventListener<'stateChange'> = () => {
    handleStateChange();
  };

  useEffect(() => {
    if (isRestoringState.current) {
      isRestoringState.current = false;
    } else if (savedGridState && !isEqual(savedGridState, prevGridState)) {
      apiRef.current.restoreState(savedGridState);
    }
  }, [savedGridState, apiRef, prevGridState]);

  return [savedGridState, onStateChange, persistedFilterModel] as const;
};
