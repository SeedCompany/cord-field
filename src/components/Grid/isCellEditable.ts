import {
  GridCellParams as CellParams,
  GridValidRowModel as RowLike,
} from '@mui/x-data-grid-pro';

export const isCellEditable = <R extends RowLike>(params: CellParams<R>) => {
  if (params.colDef.isEditable) {
    return params.colDef.isEditable(params);
  }
  return true;
};

declare module '@mui/x-data-grid/internals' {
  interface GridBaseColDef<R extends RowLike = RowLike, V = any, F = V> {
    /**
     * Is this cell editable?
     * Useful when it needs to be dynamic based on the row.
     *
     * Requires {@link editable} == true in addition to this.
     * Requires {@link isCellEditable} to be passed to the Grid.
     */
    isEditable?: (params: CellParams<R, V, F>) => boolean;
  }
}
