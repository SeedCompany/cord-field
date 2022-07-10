import { Paper, withStyles } from '@material-ui/core';

export type TableProps<_RowData extends Record<string, any>> = any;

export const Container = withStyles(() => ({
  rounded: {
    // Fix border radius when Toolbar is omitted.
    // Actual component rendering problem div is inaccessible, so we've gone up
    // to its parent. Here's the src producing it:
    // https://github.com/mbrn/material-table/blob/e81700a/src/material-table.js#L1196-L1199
    '& > div': {
      borderRadius: 'inherit',
    },
  },
  // This is the default Container, only `elevation` and styles above have changed.
}))((props) => <Paper elevation={8} {...props} />);

export const Cell = (..._props: any) => <div>cell</div>;

// TODO Reimplement table
export const Table = <_RowData extends Record<string, any>>(_props: any) => {
  return <div>table</div>;
};

// eslint-disable-next-line import/no-default-export
export default Table;
