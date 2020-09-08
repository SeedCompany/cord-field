import {
  CircularProgress,
  fade,
  makeStyles,
  Paper,
  withStyles,
} from '@material-ui/core';
import {
  Check,
  Clear,
  Edit,
  ArrowDownward as SortArrow,
} from '@material-ui/icons';
import { startCase } from 'lodash';
import MaterialTable, {
  Components,
  Icons,
  MaterialTableProps,
  MTableCell,
} from 'material-table';
import React, { forwardRef, useMemo } from 'react';
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

const Container = withStyles({
  rounded: {
    // Fix border radius when Toolbar is omitted.
    // Actual component rendering problem div is inaccessible, so we've gone up
    // to its parent. Here's the src producing it:
    // https://github.com/mbrn/material-table/blob/e81700a/src/material-table.js#L1196-L1199
    '& > div': {
      borderRadius: 'inherit',
    },
  },
  // This is the default Container, only styles above have changed.
})((props) => <Paper elevation={2} {...props} />);

const useLoadingStyles = makeStyles(
  ({ palette }) => ({
    root: {
      display: 'table',
      width: '100%',
      height: '100%',
      backgroundColor: fade(palette.background.paper, 0.7),
      borderRadius: 'inherit',
    },
    inner: {
      display: 'table-cell',
      width: '100%',
      height: '100%',
      verticalAlign: 'middle',
      textAlign: 'center',
    },
  }),
  {
    classNamePrefix: 'OverlayLoading',
  }
);
const OverlayLoading = () => {
  const classes = useLoadingStyles();
  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <CircularProgress />
      </div>
    </div>
  );
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
  Container,
  Cell,
  OverlayLoading,
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

  const columns: typeof columnsProp = useMemo(
    () =>
      columnsProp.map((column) => ({
        // Default title to field key if it's a string
        title:
          typeof column.field === 'string'
            ? startCase(column.field)
            : undefined,
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
      })),
    [columnsProp]
  );

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
