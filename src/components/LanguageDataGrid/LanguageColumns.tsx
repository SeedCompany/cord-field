import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import {
  booleanColumn,
  getInitialVisibility,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  textColumn,
  Toolbar,
  useFilterToggle,
} from '../Grid';
import { LanguageNameColumn } from '../Grid/Columns/LanguageNameColumn';
import { SensitivityColumn } from '../Grid/Columns/SensitivityColumn';
import { LanguageDataGridRowFragment as Language } from './languageDataGridRow.graphql';

export const LanguageColumns: Array<GridColDef<Language>> = [
  LanguageNameColumn({
    field: 'name',
    headerName: 'Name',
    valueGetter: (_, language) => language,
  }),
  {
    field: 'ethnologue.code',
    headerName: 'Eth Code',
    ...textColumn(),
    valueGetter: (_, { ethnologue }) => ethnologue.code.value,
    width: 90,
  },
  {
    field: 'registryOfLanguageVarietiesCode',
    headerName: 'ROLV',
    ...textColumn(),
    width: 90,
    valueGetter: (_, { registryOfLanguageVarietiesCode }) =>
      registryOfLanguageVarietiesCode.value,
  },
  SensitivityColumn({}),
  {
    field: 'population',
    headerName: 'Population',
    type: 'number',
    width: 100,
    valueGetter: (_, { population }) => population.value,
    filterable: false,
  },
  {
    field: 'usesAIAssistance',
    headerName: 'Uses AI',
    ...booleanColumn(),
    width: 150,
    valueGetter: (_, { usesAIAssistance }) => usesAIAssistance.value,
  },
  {
    field: 'id',
    headerName: 'ID',
    valueGetter: (_, language) => language.id,
    width: 150,
  },
  {
    field: 'pinned',
    headerName: 'Pinned',
    ...booleanColumn(),
  },
];

export const LanguageInitialState = {
  pinnedColumns: {
    left: LanguageColumns.slice(0, 1).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(LanguageColumns),
      pinned: false,
      id: false,
    },
  },
} satisfies DataGridProps['initialState'];

export const LanguageToolbar = () => (
  <Toolbar sx={{ justifyContent: 'flex-start', gap: 2 }}>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <QuickFilters sx={{ flex: 1 }}>
      <QuickFilterResetButton />
      <QuickFilterButton {...useFilterToggle('pinned')}>
        Pinned
      </QuickFilterButton>
    </QuickFilters>
  </Toolbar>
);
