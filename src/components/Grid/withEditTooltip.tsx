import { Tooltip } from '@mui/material';
import { GridCellProps, useGridApiContext } from '@mui/x-data-grid-pro';
import { ComponentType } from 'react';

/**
 * budget-line-items-poc (audit polish): wraps a DataGrid `cell` slot
 * component so any editable cell that isn't currently being edited shows a
 * "Double click to edit" tooltip on hover. Originally a local helper inside
 * `ProjectBudgetRecords` (the first grid to need this convention) -- pulled
 * out here so `ProjectBudgetLineItems` and `OtherPartnerContributionsGrid`
 * can share the exact same hover convention instead of each reimplementing
 * it.
 *
 * Bug fix vs. the original local version: that version read `props.isEditable`
 * / `props.cellMode` directly off the props MUI passes to a `slots.cell`
 * override. Per `@mui/x-data-grid`'s own `GridCellProps` type (see
 * `components/cell/GridCell.d.ts`), neither field is ever actually included
 * in those props -- `GridCell` itself computes both internally, from
 * `apiRef.current.getCellParams(rowId, field)`, and never forwards them
 * onward. So `props.isEditable` was always `undefined`, and this tooltip
 * never actually rendered anywhere, in any grid, despite type-checking
 * cleanly (`GridCellProps` has a `[x: string]: any` catch-all). Fixed by
 * computing the same two values the same way `GridCell` does.
 *
 * @example
 * ```tsx
 * <DataGrid slots={{ cell: withEditTooltip(GridCell) }} ... />
 * ```
 */
export const withEditTooltip = (BaseCell: ComponentType<GridCellProps>) => {
  const Cell = (props: GridCellProps) => {
    const apiRef = useGridApiContext();
    const cell = <BaseCell {...props} />;
    let isEditable = false;
    let cellMode: string | undefined;
    try {
      const params = apiRef.current.getCellParams(
        props.rowId,
        props.column.field
      );
      isEditable = params.isEditable ?? false;
      cellMode = params.cellMode;
    } catch {
      // Row/column not resolvable yet (e.g. a transient state during
      // virtualization) -- treat as non-editable rather than throwing,
      // matching `GridCell`'s own `MissingRowIdError` handling.
    }
    return isEditable && cellMode !== 'edit' ? (
      <Tooltip title="Double click to edit" placement="right">
        <div>{cell}</div>
      </Tooltip>
    ) : (
      cell
    );
  };
  Cell.displayName = `withEditTooltip(${
    BaseCell.displayName ?? BaseCell.name
  })`;
  return Cell;
};
