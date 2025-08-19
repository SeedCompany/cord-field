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
    description: 'Ethnologue Code',
    ...textColumn(),
    valueGetter: (_, { ethnologue }) => ethnologue.code.value,
    width: 120,
  },
  {
    field: 'registryOfLanguageVarietiesCode',
    headerName: 'ROLV',
    description: 'Registry of Language Varieties Code',
    ...textColumn(),
    width: 120,
    valueGetter: (_, { registryOfLanguageVarietiesCode }) =>
      registryOfLanguageVarietiesCode.value,
  },
  {
    field: 'signLanguageCode',
    headerName: 'SL Code',
    description: 'Sign Language Code',
    ...textColumn(),
    width: 120,
    valueGetter: (_, { signLanguageCode }) => signLanguageCode.value,
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
