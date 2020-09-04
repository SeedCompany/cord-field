import { withStyles } from '@material-ui/core';
import {
  Check,
  Clear,
  Edit,
  ArrowDownward as SortArrow,
} from '@material-ui/icons';
import MaterialTable, {
  Components,
  Icons,
  MaterialTableProps,
  MTableCell,
} from 'material-table';
import React, { forwardRef } from 'react';
import { Merge } from 'type-fest';

export type TableProps<RowData extends Record<string, any>> = Merge<
  MaterialTableProps<RowData>,
  {
    onRowClick?: (rowData: RowData) => void;
  }
>;

const defaultIcons: Icons = {
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <SortArrow {...props} ref={ref} />),
};

const Cell = withStyles({
  alignRight: {
    // Fix alignment of editable numeric cells
    '& > div': {
      marginLeft: 'auto',
      marginRight: 0,
    },
  },
})(MTableCell);

const defaultComponents: Components = {
  Cell,
};

export const Table = <RowData extends Record<string, any>>(
  props: TableProps<RowData>
) => {
  const {
    columns: columnsProp,
    icons: iconsProp,
    components: componentsProp,
    onRowClick,
    ...rest
  } = props;

  const columns: typeof columnsProp = columnsProp.map((column) => ({
    ...column,
    headerStyle: {
      ...column.headerStyle,
      ...(column.type === 'currency' || column.type === 'numeric'
        ? {
            // We always want the headers of currency & numeric columns
            // to be right-aligned.
            textAlign: 'right',
            // Move sorting arrow to other side so label & values are aligned.
            flexDirection: 'row-reverse',
          }
        : {}),
    },
    // This is required to fix a bug that causes column headers
    // to be fixed-width even though the default layout for the
    // table column width is 'auto'.
    width: 'auto',
  }));

  const components = componentsProp
    ? { ...defaultComponents, ...componentsProp }
    : defaultComponents;
  const icons = iconsProp ? { ...defaultIcons, ...iconsProp } : defaultIcons;

  return (
    <MaterialTable
      title="" // empty by default
      columns={columns}
      {...rest}
      icons={icons}
      components={components}
      onRowClick={onRowClick ? (_, row) => row && onRowClick(row) : undefined}
      localization={{
        ...rest.localization,
        header: {
          actions: '',
          ...rest.localization?.header,
        },
        body: {
          emptyDataSourceMessage: '',
          ...rest.localization?.body,
        },
      }}
      options={{
        paging: false,
        search: false,
        ...rest.options,
      }}
    />
  );
};
