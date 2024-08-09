import {
  getGridDefaultColumnTypes,
  GridApiCommon as GridApi,
} from '@mui/x-data-grid';
import { cmpBy } from '@seedcompany/common';

// Apply this to all column types
Object.values(getGridDefaultColumnTypes()).forEach((col) => {
  col.getSortComparator = (dir) => (a, b, aParams, bParams) => {
    const api = aParams.api as GridApi;
    const column = api.getColumn(aParams.field);

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
