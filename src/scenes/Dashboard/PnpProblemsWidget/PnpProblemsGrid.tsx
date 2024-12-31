import { Toolbar } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { SetOptional } from 'type-fest';
import { CalendarDate, extendSx } from '~/common';
import {
  booleanColumn,
  DefaultDataGridStyles,
  getInitialVisibility,
  noHeaderFilterButtons,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  useDataGridSource,
  useFilterToggle,
} from '~/components/Grid';
import { IDColumn } from '~/components/Grid/Columns/IdColumn';
import { LanguageNameColumn } from '~/components/Grid/Columns/LanguageNameColumn';
import { ProjectNameColumn } from '~/components/Grid/Columns/ProjectNameColumn';
import { PnPValidation } from '~/components/PnpValidation/PnpValidation';
import { filterForQuarter } from '../ProgressReportsWidget/ProgressReportsGrid';
import {
  PnpProblemDataGridRowFragment as PnpProblem,
  PnpProblemsDocument,
} from './pnpProblemsDataGridRow.graphql';

export type PnpProblemsColumnMapShape = Record<
  string,
  SetOptional<GridColDef<PnpProblem>, 'field'>
>;

export const ExpansionMarker = 'expandable';

export const PnpProblemsColumnMap = {
  project: ProjectNameColumn({
    field: 'engagement.project.name',
    valueGetter: (_, p) => p.parent.project,
  }),
  language: LanguageNameColumn({
    field: 'engagement.language.name',
    valueGetter: (_, p) => p.parent.language.value!,
  }),
  viewReport: IDColumn({
    field: 'id',
    valueGetter: (_, p) => p,
    title: 'Report',
    destination: (id) => `/progress-reports/${id}`,
  }),
  countError: {
    headerName: 'Errors',
    field: 'pnpExtractionResult',
    type: 'number',
    headerAlign: 'center',
    width: 150,
    valueGetter: (_, row) =>
      row.pnpExtractionResult?.problems.filter((p) => p.severity === 'Error')
        .length,
    renderCell: ({ row }) => (
      <PnPValidation result={row.pnpExtractionResult!} />
    ),
    filterable: false,
  },
  isMember: {
    headerName: 'Mine',
    field: 'engagement.project.isMember',
    ...booleanColumn(),
    valueGetter: (_, row) => row.parent.project.isMember,
  },
  pinned: {
    headerName: 'Pinned',
    field: 'engagement.project.pinned',
    ...booleanColumn(),
    valueGetter: (_, row) => row.parent.project.pinned,
  },
} satisfies PnpProblemsColumnMapShape;

const columns = Object.values(PnpProblemsColumnMap);

export interface PnpProblemsGridProps extends DataGridProps {
  quarter: CalendarDate;
  expanded: boolean;
}

export const PnpProblemsGrid = ({
  quarter,
  expanded,
  ...props
}: Omit<PnpProblemsGridProps, 'columns'>) => {
  const source = useMemo(() => {
    return {
      query: PnpProblemsDocument,
      variables: {
        input: {
          filter: {
            ...filterForQuarter(quarter),
            pnpExtractionResult: {
              hasError: true,
            },
          },
        },
      },
      listAt: 'progressReports',
      initialInput: {
        sort: 'engagement.project.name',
        order: 'ASC',
      },
    } as const;
  }, [quarter]);
  const [dataGridProps] = useDataGridSource({
    ...source,
    apiRef: props.apiRef,
  });

  const initialState = {
    pinnedColumns: {
      left: columns.slice(0, 3).map((column) => column.field),
    },
    columns: {
      columnVisibilityModel: {
        ...getInitialVisibility(columns),
        viewReport: expanded,
        'engagement.project.isMember': false,
        'engagement.project.pinned': false,
      },
    },
  } satisfies DataGridProps['initialState'];

  const toolbarSlot = {
    toolbar: PnpProblemsToolbar,
  } satisfies DataGridProps['slots'];

  const slots = useMemo(
    () =>
      merge(
        {},
        DefaultDataGridStyles.slots,
        dataGridProps.slots,
        props.slots,
        expanded && toolbarSlot
      ),
    [dataGridProps.slots, props.slots, toolbarSlot, expanded]
  );

  const slotProps = useMemo(
    () =>
      merge(
        {},
        DefaultDataGridStyles.slotProps,
        dataGridProps.slotProps,
        props.slotProps
      ),
    [dataGridProps.slotProps, props.slotProps]
  );

  return (
    <DataGridPro
      {...DefaultDataGridStyles}
      {...dataGridProps}
      {...props}
      columns={columns}
      initialState={initialState}
      slots={slots}
      slotProps={slotProps}
      density="standard"
      sx={[noHeaderFilterButtons, ...extendSx(props.sx)]}
    />
  );
};

const PnpProblemsToolbar = () => (
  <Toolbar
    sx={{
      px: 2,
      justifyContent: 'flex-start',
      gap: 2,
      backgroundColor: 'inherit',
    }}
  >
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <QuickFilters sx={{ flex: 1 }}>
      <QuickFilterResetButton />
      <QuickFilterButton {...useFilterToggle('engagement.project.isMember')}>
        Mine
      </QuickFilterButton>
      <QuickFilterButton {...useFilterToggle('engagement.project.pinned')}>
        Pinned
      </QuickFilterButton>
    </QuickFilters>
  </Toolbar>
);
