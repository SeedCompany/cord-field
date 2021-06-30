import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Components, MTableBodyRow } from 'material-table';
import React, { ReactNode } from 'react';
import { ChangesetBadge, DiffMode } from '../Changeset';
import { Cell, Container, Table, TableProps } from './Table';

const useStyles = makeStyles(() => ({
  table: {
    '& > div': {
      overflowX: 'unset !important',
    },
    '& > div > div > div': {
      overflowY: 'unset !important',
    },
  },

  row: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: '50%',
    left: 0,
  },
}));

export interface ChangesetRowData {
  diffMode: DiffMode | undefined;
  diffInfo: ReactNode | undefined;
}

const ChangesetAwareCell = (props: any) => {
  const { diffMode, diffInfo } = props.rowData as ChangesetRowData;
  const classes = useStyles();

  let children = props.children;
  if (props.columnDef.renderChangesetBadge) {
    children = (
      <ChangesetBadge
        mode={diffMode}
        classes={{
          root: classes.badge,
        }}
        moreInfo={diffInfo}
      >
        {children}
      </ChangesetBadge>
    );
  }

  return <Cell {...props}>{children}</Cell>;
};

const ChangesetAwareRow = (props: any) => {
  const classes = useStyles();

  const col = props.columns.find(
    (columnDef: any) =>
      !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
  );
  if (col) {
    col.renderChangesetBadge = true;
  }

  return (
    <MTableBodyRow {...props} className={clsx(props.className, classes.row)} />
  );
};

const ChangesetAwareContainer = (props: any) => {
  const classes = useStyles();
  return (
    <Container {...props} className={clsx(props.className, classes.table)} />
  );
};

const tableComponents: Components = {
  Row: ChangesetAwareRow,
  Cell: ChangesetAwareCell,
  Container: ChangesetAwareContainer,
};

export type ChangesetAwareTableProps<T extends ChangesetRowData> =
  TableProps<T> & { moreInfo?: ReactNode };

export const ChangesetAwareTable = <T extends ChangesetRowData>(
  props: ChangesetAwareTableProps<T>
) => {
  return (
    <Table
      {...props}
      components={{ ...tableComponents, ...props.components }}
      options={{
        ...props.options,
        headerStyle: {
          ...props.options?.headerStyle,
          position: 'unset',
        },
      }}
    />
  );
};

// eslint-disable-next-line import/no-default-export
export default ChangesetAwareTable;
