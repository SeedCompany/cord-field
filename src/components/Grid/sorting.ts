import {
  getGridDefaultColumnTypes,
  GridApiCommon as GridApi,
  GridSortCellParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { cmpBy } from '@seedcompany/common';

// Apply this to all column types
Object.values(getGridDefaultColumnTypes()).forEach((col) => {
  col.getSortComparator = (dir) => (maybeA, maybeB, aParams, bParams) => {
    const api = aParams.api as GridApi;
    const column = api.getColumn(aParams.field);

    // Call column's sortBy to get the value to compare.
    const a = column.sortBy ? column.sortBy(maybeA, aParams) : maybeA;
    const b = column.sortBy ? column.sortBy(maybeB, bParams) : maybeB;

    // Sort nulls last, always
    if (a == null && b != null) {
      return 1;
    }
    if (a != null && b == null) {
      return -1;
    }
    if (a == null && b == null) {
      return 0;
    }

    // If for some reason this is null, it shouldn't be, then use our
    // cmpBy function to compare the values.
    if (!column.sortComparator) {
      return cmpBy([(v: any) => v, dir ?? 'asc'])(a, b);
    }

    // Forward to default comparator for the column type.
    return (
      column.sortComparator(a, b, aParams, bParams) * (dir === 'desc' ? -1 : 1)
    );
  };
});

declare module '@mui/x-data-grid/internals' {
  interface GridBaseColDef<
    // eslint-disable-next-line @seedcompany/no-unused-vars
    R extends GridValidRowModel = GridValidRowModel,
    V = any,
    // eslint-disable-next-line @seedcompany/no-unused-vars
    F = V
  > {
    /**
     * Customize the value to use for sorting.
     * This will be called before calling {@link sortComparator}.
     * {@link getSortComparator} still takes precedence over this.
     */
    sortBy?: (value: V, cellParams: GridSortCellParams<V>) => any;
  }
}
