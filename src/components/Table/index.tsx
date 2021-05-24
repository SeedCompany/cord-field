import loadable, { LoadableComponentMethods } from '@loadable/component';
import React, { ReactElement } from 'react';
import { TableProps } from './Table';
import { TableLoading } from './TableLoading';

// loadable doesn't play nice with components that have generics
// so we need to manually define the type
type LazyTable = (<RowData extends Record<string, any>>(
  props: TableProps<RowData> & { fallback?: ReactElement }
) => ReactElement) &
  LoadableComponentMethods<TableProps<any>>;

export const Table = loadable(() => import('./Table'), {
  fallback: <TableLoading />,
}) as unknown as LazyTable;
