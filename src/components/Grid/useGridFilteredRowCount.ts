import { gridFilteredTopLevelRowCountSelector } from '@mui/x-data-grid';
import { GridApiPro } from '@mui/x-data-grid-pro';
import { MutableRefObject, useSyncExternalStore } from 'react';

/**
 * Reactively reads the number of top-level rows that pass the DataGrid's
 * current client-side filter. Safe to call before the grid has mounted —
 * returns undefined until the grid initialises.
 */
export function useGridFilteredRowCount(apiRef: MutableRefObject<GridApiPro>) {
  return useSyncExternalStore(
    (callback) =>
      apiRef.current.subscribeEvent
        ? apiRef.current.subscribeEvent('stateChange', callback)
        : () => {},
    () => {
      try {
        if (!apiRef.current.instanceId) return undefined;
        return gridFilteredTopLevelRowCountSelector(apiRef);
      } catch {
        return undefined;
      }
    },
    () => undefined as number | undefined,
  );
}
