import {
  DataGridProProps as DataGridProps,
  GridFilterItem as FilterItem,
  GridApiPro as GridApi,
  GridValidRowModel as RowModel,
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
    const getAsApiInput = col.filterOperators?.find(
      (op) => op.value === item.operator
    )?.getAsApiInput;
    const value = getAsApiInput ? getAsApiInput(item) : item.value;
    if (value == null) {
      return null;
    }
    return col.serverFilter
      ? col.serverFilter(value, item)
      : set({}, item.field, value);
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
    serverFilter?: (value: any, item: FilterItem) => Record<string, any>;
  }
}

declare module '@mui/x-data-grid/models' {
  interface GridFilterOperator<
    // eslint-disable-next-line @seedcompany/no-unused-vars
    R extends RowModel = any,
    V = any,
    // eslint-disable-next-line @seedcompany/no-unused-vars
    F = V
  > {
    /**
     * Customize how a {@see FilterItem} converts to the filter value for API input.
     * @default (filterItem) => filterItem.value
     */
    getAsApiInput?: (filterItem: FilterItem) => any;
  }
}
