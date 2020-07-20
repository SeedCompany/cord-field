import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ArrowDownward, Check, Clear, Edit } from '@material-ui/icons';
import MaterialTable, {
  Column,
  Icons,
  MTableBody,
  MTableBodyRow,
} from 'material-table';
import React, { FC, forwardRef, useCallback, useEffect, useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export interface RowData {
  [key: string]: any;
}

interface TableProps {
  columns: Array<Column<RowData>>;
  data: RowData[];
  draggable?: boolean;
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
    draggable,
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
        isEditable: (rowData: RowData) => !!rowData.canEdit,
        isDeletable: () => false,
        onRowUpdate,
      };

  const handleBeforeCapture = useCallback((before) => {
    console.log('before', before);
  }, []);

  const handleBeforeDragStart = useCallback((start) => {
    console.log('start', start);
  }, []);

  const handleDragStart = useCallback((start, provided) => {
    console.log('start', start);
    console.log('provided', provided);
  }, []);

  const handleDragUpdate = useCallback((update, provided) => {
    console.log('update', update);
    console.log('provided', provided);
  }, []);

  const handleDragEnd = useCallback((result, provided) => {
    console.log('result', result);
    console.log('provided', provided);
  }, []);

  /* eslint-disable @typescript-eslint/unbound-method */
  const RowComponent = (props: any) => {
    const {
      data: {
        id,
        item: { type },
      },
      index,
    } = props;
    return (
      <Draggable
        draggableId={id}
        index={index}
        isDragDisabled={type !== 'File'}
      >
        {(provided) => (
          <MTableBodyRow
            innerRef={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            {...props}
          />
        )}
      </Draggable>
    );
  };

  const renderClone = useCallback(
    (provided) => (
      <div
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        <Typography variant="body2">Dragging, dragging, dragging</Typography>
      </div>
    ),
    []
  );

  const tableBodyRef = useRef(null);
  useEffect(() => console.log('tableBodyRef', tableBodyRef.current), [
    tableBodyRef,
  ]);

  return (
    <DragDropContext
      onBeforeCapture={handleBeforeCapture}
      onBeforeDragStart={handleBeforeDragStart}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleDragEnd}
    >
      <Droppable
        droppableId="table"
        renderClone={renderClone}
        getContainerForClone={
          tableBodyRef.current ? () => tableBodyRef.current! : undefined
        }
      >
        {(provided) => (
          <MaterialTable
            columns={columns}
            components={{
              ...(draggable
                ? {
                    Container: ({ children, ...props }) => (
                      <Paper
                        innerRef={provided.innerRef}
                        {...provided.droppableProps}
                        {...props}
                      >
                        {children}
                        {provided.placeholder}
                      </Paper>
                    ),
                    Body: ({ children, ...props }) => (
                      <MTableBody {...props}>
                        <tbody ref={tableBodyRef}>{children}</tbody>
                      </MTableBody>
                    ),
                    Row: RowComponent,
                  }
                : null),
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
              grouping: false,
              paging: false,
              search: false,
            }}
          />
        )}
      </Droppable>
    </DragDropContext>
  );
};
