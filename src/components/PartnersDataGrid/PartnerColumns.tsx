import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import {
  FinancialReportingTypeLabels,
  FinancialReportingTypeList,
  PartnerTypeLabels,
  PartnerTypeList,
} from '~/api/schema.graphql';
import {
  booleanColumn,
  getInitialVisibility,
  multiEnumColumn,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  Toolbar,
  useFilterToggle,
} from '../Grid';
import { PartnerNameColumn } from '../Grid/Columns/PartnerNameColumn';
import { PartnerDataGridRowFragment as Partner } from './partnerDataGridRow.graphql';

export const PartnerColumns: Array<GridColDef<Partner>> = [
  PartnerNameColumn({
    field: 'organization.name',
    headerName: 'Name',
    valueGetter: (_, partner) => partner,
    width: 300,
  }),
  {
    field: 'organization.acronym',
    headerName: 'Acronym',
    valueGetter: (_, { organization }) => organization.value?.acronym.value,
    width: 100,
  },
  {
    field: 'globalInnovationsClient',
    headerName: 'GPC',
    description: 'Growth Partners Client',
    ...booleanColumn(),
    valueGetter: (_, { globalInnovationsClient }) =>
      globalInnovationsClient.value,
  },
  {
    field: 'types',
    headerName: 'Roles',
    ...multiEnumColumn(PartnerTypeList, PartnerTypeLabels),
    valueFormatter: (_, { types }) =>
      types.value.map((type) => PartnerTypeLabels[type]).join(', '),
    valueGetter: (_, { types }) => {
      return types.value;
    },
    width: 300,
  },
  {
    field: 'financialReportingTypes',
    headerName: 'Financial Reporting Types',
    ...multiEnumColumn(
      FinancialReportingTypeList,
      FinancialReportingTypeLabels
    ),
    valueFormatter: (_, { financialReportingTypes }) =>
      financialReportingTypes.value
        .map((type) => FinancialReportingTypeLabels[type])
        .join(', '),
    valueGetter: (_, { financialReportingTypes }) => {
      return financialReportingTypes.value;
    },
    width: 300,
  },
  {
    field: 'pinned',
    ...booleanColumn(),
    headerName: 'Pinned',
  },
];

export const PartnerInitialState = {
  pinnedColumns: {
    left: PartnerColumns.slice(0, 1).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(PartnerColumns),
      isMember: false,
      pinned: false,
    },
  },
} satisfies DataGridProps['initialState'];

export const PartnerToolbar = () => (
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
