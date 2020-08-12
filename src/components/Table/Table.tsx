import { createMuiTheme, ThemeProvider, useTheme } from '@material-ui/core';
import { ArrowDownward, Check, Clear, Edit } from '@material-ui/icons';
import MaterialTable, { Column, Icons } from 'material-table';
import React, { forwardRef, ReactElement } from 'react';

interface TableProps<RowData extends Record<string, any>> {
  onRowClick?: (rowData: RowData) => void;
  columns: Array<Column<RowData>>;
  data: RowData[];
  header?: ReactElement;
  isEditable?: boolean;
  onRowUpdate?: (newData: RowData, oldData?: RowData) => Promise<unknown>;
  toolbarContents?: ReactElement;
}

export const Table = <RowData extends Record<string, any>>(
  props: TableProps<RowData>
) => {
  const {
    onRowClick,
    columns: columnData,
    data,
    isEditable = false,
    onRowUpdate,
    toolbarContents,
  } = props;

  const theme = useTheme();
  const tableTheme = createMuiTheme({
    ...theme,
    overrides: {
      MuiTableRow: {
        root: {
          ...(onRowClick ? { cursor: 'pointer' } : null),
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  });

  /* We'll always want the headers of currency columns
    to be right-aligned, so let's do it here instead
    of having to pass styles every time. */
  const columns = columnData.map((column) =>
    column.type === 'currency'
      ? {
          ...column,
          headerStyle: {
            ...column.cellStyle,
            textAlign: 'right' as const,
          },
          cellStyle: {
            ...column.cellStyle,
            /* Compensate for the sort icon in the header
              so the text still comes out looking nicely
              right-aligned with the header text. */
            paddingRight: 'calc(1em + 4px + 4px + 16px)',
          },
        }
      : {
          ...column,
          // This is required to fix a bug that causes column headers
          // to be fixed-width even though the default layout for the
          // table column width is 'auto'.
          width: 'auto',
        }
  );

  const icons: Icons = {
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
  };

  const editable = !isEditable
    ? undefined
    : {
        isEditable: (rowData: any) => !!rowData.canEdit,
        isDeletable: () => false,
        onRowUpdate,
      };

  const handleRowClick = (_?: React.MouseEvent, rowData?: RowData) => {
    onRowClick && rowData && onRowClick(rowData);
  };

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialTable
        columns={columns}
        components={{
          Toolbar: () => toolbarContents ?? null,
        }}
        data={data}
        editable={editable}
        icons={icons}
        localization={{
          header: {
            actions: '',
          },
          body: {
            emptyDataSourceMessage: '',
          },
        }}
        onRowClick={handleRowClick}
        options={{
          paging: false,
          search: false,
        }}
      />
    </ThemeProvider>
  );
};
