import { Paper, SxProps, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DataGridPro as DataGrid,
  DataGridProProps,
  getGridSingleSelectOperators,
  GridColDef,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { cmpBy } from '@seedcompany/common';
import { ReactNode } from 'react';

interface GridDetailsProps {
  isCacheComplete: boolean | undefined;
  total: number;
  list: readonly any[] | undefined;
}

interface TableGridProps<T extends GridValidRowModel> {
  tableProps: Partial<DataGridProProps & GridDetailsProps>;
  columns: Array<GridColDef<T>>;
  initialState?: DataGridProProps['initialState'];
  hasTabContainer?: boolean;
  tabStyles?: SxProps<Theme>;
}

export const TabContainer = styled(Paper)(() => ({
  flex: 1,
  padding: 0,
  maxWidth: '100cqw',
  width: 'min-content',
  maxHeight: 'calc(100cqh - 50px)',
}));

export const TableGrid = <T extends GridValidRowModel>(
  props: TableGridProps<T>
) => {
  const { tableProps, columns, initialState, hasTabContainer, tabStyles } =
    props;

  const Container = ({ children }: { children: ReactNode }) =>
    hasTabContainer ? (
      <TabContainer
        sx={{
          ...tabStyles,
        }}
      >
        {children}
      </TabContainer>
    ) : (
      children
    );
  return (
    <Container>
      <DataGrid
        density="compact"
        columns={columns}
        disableRowSelectionOnClick
        headerFilters
        headerFilterHeight={90}
        initialState={initialState}
        className="flex-layout"
        sx={{
          '.MuiDataGrid-headerFilterRow .MuiDataGrid-columnHeader button': {
            display: 'none',
          },
        }}
        ignoreDiacritics
        {...tableProps}
      />
    </Container>
  );
};

export const enumColumn = <T extends string>(
  list: readonly T[],
  labels: Record<T, string>,
  { orderByIndex }: { orderByIndex?: boolean } = {}
) =>
  ({
    type: 'singleSelect',
    filterOperators: getGridSingleSelectOperators().filter(
      (op) => op.value !== 'not'
    ),
    valueOptions: list.map((v) => ({
      value: v,
      label: labels[v],
    })),
    valueFormatter: (value: T) => labels[value],
    ...(orderByIndex ? { sortComparator: cmpBy((v) => list.indexOf(v)) } : {}),
  } satisfies Partial<GridColDef<any, T, string>>);
