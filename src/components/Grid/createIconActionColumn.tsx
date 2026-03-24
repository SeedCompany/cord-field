import { IconButton, Tooltip } from '@mui/material';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import type { ReactNode } from 'react';

type ValueOrFactory<Row extends GridValidRowModel, T> = T | ((row: Row) => T);

export interface CreateIconActionColumnOptions<Row extends GridValidRowModel> {
  field?: string;
  headerName?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  tooltip: ValueOrFactory<Row, string>;
  icon: ValueOrFactory<Row, ReactNode>;
  onClick: (row: Row) => void;
  disabled?: (row: Row) => boolean;
}

const resolveValue = <Row extends GridValidRowModel, T>(
  value: ValueOrFactory<Row, T>,
  row: Row
): T => {
  if (typeof value === 'function') {
    return (value as (row: Row) => T)(row);
  }
  return value;
};

export const createIconActionColumn = <Row extends GridValidRowModel>({
  field,
  headerName,
  width,
  align,
  onClick,
  icon,
  tooltip,
  disabled,
}: CreateIconActionColumnOptions<Row>): GridColDef<Row> => ({
  field: field ?? 'actions',
  headerName: headerName ?? '',
  width: width ?? 60,
  align: align ?? 'center',
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  hideable: false,
  renderCell: ({ row }) => {
    const isDisabled = disabled?.(row) ?? false;
    return (
      <Tooltip title={resolveValue(tooltip, row)}>
        <span>
          <IconButton
            size="small"
            aria-label={resolveValue(tooltip, row)}
            disabled={isDisabled}
            onClick={() => onClick(row)}
          >
            {resolveValue(icon, row)}
          </IconButton>
        </span>
      </Tooltip>
    );
  },
});
