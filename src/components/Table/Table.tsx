import { makeStyles, Typography } from '@material-ui/core';
import { ArrowDownward, Check, Clear, Edit } from '@material-ui/icons';
import MaterialTable, { Column, Icons } from 'material-table';
import React, { FC, forwardRef } from 'react';

export interface RowData {
  [key: string]: string | number | boolean;
}

interface TableProps {
  columns: Array<Column<RowData>>;
  data: RowData[];
  header?: React.ReactElement;
  isEditable?: boolean;
  onRowUpdate?: (newData: RowData, oldData?: RowData) => Promise<any>;
  title?: string;
}

const useStyles = makeStyles(({ spacing }) => ({
  toolbar: {
    padding: spacing(2),
    paddingBottom: spacing(1),
  },
}));

export const Table: FC<TableProps> = (props) => {
  const {
    columns: columnData,
    data,
    isEditable = false,
    onRowUpdate,
    title,
  } = props;
  const classes = useStyles();

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
      : column
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
        isEditable: (rowData: RowData) => !!rowData.canEdit,
        isDeletable: () => false,
        onRowUpdate,
      };

  return (
    <MaterialTable
      columns={columns}
      components={{
        Toolbar: () =>
          title ? (
            <div className={classes.toolbar}>
              <Typography variant="h3">{title}</Typography>
            </div>
          ) : null,
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
      options={{
        paging: false,
        search: false,
      }}
    />
  );
};
