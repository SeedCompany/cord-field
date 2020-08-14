import { ArrowDownward, Check, Clear, Edit } from '@material-ui/icons';
import MaterialTable, { Icons, MaterialTableProps } from 'material-table';
import React from 'react';
import { Merge } from 'type-fest';

export type TableProps<RowData extends Record<string, any>> = Merge<
  MaterialTableProps<RowData>,
  {
    isEditable?: boolean;
    onRowUpdate?: (newData: RowData, oldData?: RowData) => Promise<unknown>;
    onRowClick?: (rowData: RowData) => void;
  }
>;

const defaultIcons: Icons = {
  Check,
  Clear,
  Edit,
  SortArrow: ArrowDownward,
};

export const Table = <RowData extends Record<string, any>>(
  props: TableProps<RowData>
) => {
  const {
    columns: columnsProp,
    icons: iconsProp,
    isEditable = false,
    onRowUpdate,
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

  const editable = !isEditable
    ? undefined
    : {
        isEditable: (rowData: any) => !!rowData.canEdit,
        isDeletable: () => false,
        onRowUpdate,
      };

  const icons = iconsProp ? { ...defaultIcons, ...iconsProp } : defaultIcons;

  return (
    <MaterialTable
      title="" // empty by default
      columns={columns}
      {...rest}
      editable={editable}
      icons={icons}
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
