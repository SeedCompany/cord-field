import { Box } from '@mui/material';
import {
  DataGridPro as DataGrid,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { cleanJoin, cmpBy } from '@seedcompany/common';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  EngagementStatusLabels,
  EngagementStatusList,
  ProgressReportStatusLabels,
  ProgressReportStatusList,
  ProjectStepLabels,
  ProjectStepList,
  ProjectTypeLabels,
  ProjectTypeList,
  SensitivityLabels,
  SensitivityList,
} from '~/api/schema.graphql';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useTable } from '~/hooks';
import {
  DefaultDataGridStyles,
  EmptyEnumFilterValue,
} from '../../../../../components/Grid/DefaultDataGridStyles';
import { Link } from '../../../../../components/Routing';
import { PartnerTabContainer } from '../PartnerTabContainer';
import {
  PartnerDetailEngagementsTableListItemFragment as Engagement,
  PartnerDetailEngagementsDocument,
} from './PartnerDetailEngagements.graphql';

export const PartnerDetailEngagements = () => {
  const { partnerId = '' } = useParams();

  const [props] = useTable({
    query: PartnerDetailEngagementsDocument,
    variables: { id: partnerId },
    listAt: 'partner.engagements',
    initialInput: {
      count: 25,
      sort: 'nameProjectFirst',
    },
  });

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  return (
    <PartnerTabContainer
      sx={{
        flex: 1,
        p: 0,
        maxWidth: '100cqw',
        width: 'min-content',
        // idk why -50, MUI pushes down past container
        maxHeight: 'calc(100cqh - 50px)',
      }}
    >
      <DataGrid<Engagement>
        density="compact"
        {...DefaultDataGridStyles}
        {...props}
        slotProps={slotProps}
        columns={columns}
        disableRowSelectionOnClick
        headerFilters
        headerFilterHeight={90}
        initialState={{
          pinnedColumns: {
            left: ['nameProjectFirst'],
          },
        }}
        className="flex-layout"
        sx={{
          // Hide filter operator button since there aren't multiple operators
          '.MuiDataGrid-headerFilterRow .MuiDataGrid-columnHeader button': {
            display: 'none',
          },
        }}
        ignoreDiacritics
      />
    </PartnerTabContainer>
  );
};

const enumColumn = <T extends string>(
  list: readonly T[],
  labels: Record<T, string>,
  { orderByIndex }: { orderByIndex?: boolean } = {}
) =>
  ({
    type: 'singleSelect',
    filterOperators: getGridSingleSelectOperators().filter(
      (op) => op.value !== 'not'
    ),
    valueOptions: list.slice(),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    getOptionLabel: (v) => labels[v as T] ?? EmptyEnumFilterValue,
    valueFormatter: (value: T) => labels[value],
    ...(orderByIndex ? { sortComparator: cmpBy((v) => list.indexOf(v)) } : {}),
  } satisfies Partial<GridColDef<any, T, string>>);

const containsOp = {
  ...getGridStringOperators()[0]!,
  label: 'search',
  headerLabel: 'search',
};
const textColumn = {
  filterOperators: [containsOp],
  headerClassName: 'no-filter-button',
};

const columns: Array<GridColDef<Engagement>> = [
  {
    headerName: 'Name',
    field: 'nameProjectFirst',
    ...textColumn,
    minWidth: 200,
    valueGetter: (_, row) =>
      cleanJoin(' - ', [
        row.project.name.value,
        row.__typename === 'LanguageEngagement'
          ? row.language.value?.name.value
          : row.__typename === 'InternshipEngagement'
          ? row.intern.value?.fullName
          : null,
      ]),
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.project.id}`}>{value}</Link>
    ),
    serverFilter: ({ value }) => ({ name: value }),
  },
  {
    headerName: 'Type',
    field: 'project.type',
    ...enumColumn(ProjectTypeList, ProjectTypeLabels),
    width: 130,
    valueGetter: (_, row) => row.project.type,
  },
  {
    headerName: 'Project Step',
    field: 'project.step',
    width: 250,
    valueGetter: (_, row) => row.project.step.value,
    ...enumColumn(ProjectStepList, ProjectStepLabels, {
      orderByIndex: true,
    }),
  },
  {
    headerName: 'Engagement Status',
    field: 'status',
    ...enumColumn(EngagementStatusList, EngagementStatusLabels, {
      orderByIndex: true,
    }),
    width: 190,
    valueGetter: (_, row) => row.status.value,
  },
  {
    headerName: 'Country',
    field: 'project.primaryLocation.name',
    ...textColumn,
    valueGetter: (_, row) => row.project.primaryLocation.value?.name.value,
    filterable: false,
  },
  {
    headerName: 'ISO',
    description: 'Ethnologue Code',
    field: 'language.ethnologue.code',
    ...textColumn,
    width: 95,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.ethnologue.code.value?.toUpperCase()
        : '',
  },
  {
    headerName: 'ROD',
    description: 'Registry of Dialects',
    field: 'language.registryOfDialectsCode',
    ...textColumn,
    width: 95,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.registryOfDialectsCode.value
        : '',
  },
  {
    headerName: 'MOU Start',
    field: 'startDate',
    type: 'date',
    valueGetter: (_, { startDate }) => startDate.value?.toJSDate(),
    filterable: false,
  },
  {
    headerName: 'MOU End',
    field: 'endDate',
    type: 'date',
    valueGetter: (_, { endDate }) => endDate.value?.toJSDate(),
    filterable: false,
  },
  {
    headerName: 'QR Status',
    description: 'Status of Quarterly Report Currently Due',
    field: 'currentProgressReportDue.status',
    ...enumColumn(ProgressReportStatusList, ProgressReportStatusLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement' &&
      row.currentProgressReportDue.value
        ? row.currentProgressReportDue.value.status.value
        : null,
    renderCell({ formattedValue: value, row }) {
      const report =
        row.__typename === 'LanguageEngagement'
          ? row.currentProgressReportDue.value
          : undefined;
      if (!report) {
        return null;
      }
      return <Link to={`/progress-reports/${report.id}`}>{value}</Link>;
    },
    filterable: false,
  },
  {
    headerName: 'Sensitivity',
    field: 'project.sensitivity',
    width: 110,
    ...enumColumn(SensitivityList, SensitivityLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) => row.project.sensitivity,
    renderCell: ({ value }) => (
      <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
        <SensitivityIcon value={value} disableTooltip />
        {value}
      </Box>
    ),
  },
  {
    headerName: 'Files',
    field: 'files',
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => (
      <Link to={`/projects/${row.project.id}/files`}>View Files</Link>
    ),
  },
];
