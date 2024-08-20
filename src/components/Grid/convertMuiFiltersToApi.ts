import {
  DataGridProProps as DataGridProps,
  GridFilterItem as FilterItem,
  GridApiPro as GridApi,
} from '@mui/x-data-grid-pro';
import { merge, set } from 'lodash';

export type FilterShape = Partial<Record<string, any>>;

export const convertMuiFiltersToApi = <Filters extends FilterShape>(
  api: GridApi,
  next: DataGridProps['filterModel'],
  ...external: Array<Filters | undefined>
): Filters | undefined => {
  if (!next) {
    return undefined;
  }
  const parts = next.items.map((item) => {
    const col = api.getColumn(item.field);
    return item.value == null
      ? null
      : col.serverFilter
      ? col.serverFilter(item)
      : set({}, item.field, item.value);
  });
  const filter = merge({}, ...parts, ...external);
  return Object.keys(filter).length > 0 ? filter : undefined;
};

declare module '@mui/x-data-grid/internals' {
  interface GridBaseColDef {
    /**
     * Customize how GridFilterItem converts to the filter object for API.
     * By default, the field name becomes the path key of the object.
     */
    serverFilter?: (item: FilterItem) => Record<string, any>;
  }
}
