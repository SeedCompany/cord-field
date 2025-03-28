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
import { LanguageListItemFragment as Language } from '../LanguageListItemCard/LanguageListItem.graphql';

export const LanguageColumns: Array<GridColDef<Language>> = [
  LanguageNameColumn({
    field: 'name',
    headerName: 'Name',
    valueGetter: (_, language) => language,
    flex: 1,
  }),
  {
    field: 'ethnologue.code',
    headerName: 'Eth Code',
    ...textColumn(),
    valueGetter: (_, { ethnologue }) => ethnologue.code.value,
    width: 200,
  },
  {
    field: 'registryOfLanguageVarietiesCode',
    headerName: 'ROLV',
    ...textColumn(),
    width: 200,
    valueGetter: (_, { registryOfLanguageVarietiesCode }) =>
      registryOfLanguageVarietiesCode.value,
  },
  {
    field: 'population',
    headerName: 'Population',
    headerAlign: 'left',
    type: 'number',
    width: 160,
    valueGetter: (_, { population }) => population.value,
    filterable: false,
  },
  SensitivityColumn({}),
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
