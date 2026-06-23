import {
  DataGridProProps,
  GridColDef,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useIsMobile } from '~/common';

/**
 * For data grids that have no dedicated mobile list view, this narrows them on
 * small screens: columns flagged `mobileHidden` are hidden and the primary
 * column(s) are pinned left so the identity stays visible while the rest scroll.
 *
 * Returns the grid's `initialState` unchanged on desktop, and a merged
 * `initialState` on mobile — pass the result straight to `<DataGridPro initialState={...}>`.
 * Because it works through `initialState` (applied at mount), it adapts on load
 * rather than live breakpoint changes, which is sufficient for these fallback grids.
 */
export const useResponsiveColumnVisibility = (
  columns: readonly GridColDef[],
  initialState: DataGridProProps['initialState'],
  { pinnedLeft = [] }: { pinnedLeft?: readonly string[] } = {}
): DataGridProProps['initialState'] => {
  const isMobile = useIsMobile();
  return useMemo(() => {
    if (!isMobile) {
      return initialState;
    }
    const columnVisibilityModel: GridColumnVisibilityModel = {};
    for (const column of columns) {
      if (column.mobileHidden) {
        columnVisibilityModel[column.field] = false;
      }
    }
    const merged = merge({}, initialState, {
      columns: { columnVisibilityModel },
    });
    // Pin the primary column(s) left on mobile. Assign after the merge so the
    // array is replaced wholesale — lodash `merge` merges arrays by index, which
    // would otherwise leave stale trailing entries from `initialState`.
    return pinnedLeft.length > 0
      ? {
          ...merged,
          pinnedColumns: { ...merged.pinnedColumns, left: [...pinnedLeft] },
        }
      : merged;
  }, [isMobile, columns, initialState, pinnedLeft]);
};
