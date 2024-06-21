import { Box } from '@mui/material';
import {
  DataGridPro as DataGrid,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
} from '@mui/x-data-grid-pro';
import {
  cleanJoin,
  cmpBy,
  mapEntries,
  simpleSwitch,
} from '@seedcompany/common';
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
import { Sensitivity } from '~/api/schema/schema.graphql';
import { labelFrom } from '~/common';
import { FormattedDate } from '~/components/Formatters';
import { SensitivityIcon } from '~/components/Sensitivity';
import { useTable } from '~/hooks';
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
      count: 20,
      sort: 'nameProjectFirst',
    },
  });

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
        {...props}
        columns={columns}
        disableRowSelectionOnClick
        headerFilters
        headerFilterHeight={90}
        initialState={{
          pinnedColumns: {
            // Flaky with our current layout.
            // MUI doesn't render it a lot of the times.
            // left: ['nameProjectFirst'],
          },
        }}
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
  labels: Record<T, string>
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
    ...enumColumn(ProjectStepList, ProjectStepLabels),
  },
  {
    headerName: 'Engagement Status',
    field: 'status',
    ...enumColumn(EngagementStatusList, EngagementStatusLabels),
    width: 190,
    valueGetter: (_, row) => row.status.value,
    valueFormatter: (_, row) =>
      labelFrom(EngagementStatusLabels)(row.status.value),
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
    width: 75,
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
    width: 80,
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement'
        ? row.language.value?.registryOfDialectsCode.value
        : '',
  },
  {
    headerName: 'MOU Start',
    field: 'startDate',
    valueGetter: (_, { startDate }) => startDate.value,
    renderCell: ({ value }) => <FormattedDate date={value} />,
    filterable: false,
  },
  {
    headerName: 'MOU End',
    field: 'endDate',
    valueGetter: (_, { endDate }) => endDate.value,
    renderCell: ({ value }) => <FormattedDate date={value} />,
    filterable: false,
  },
  {
    headerName: 'QR Status',
    description: 'Status of Quarterly Report Currently Due',
    field: 'currentProgressReportDue.status',
    ...enumColumn(ProgressReportStatusList, ProgressReportStatusLabels),
    valueGetter: (_, row) =>
      row.__typename === 'LanguageEngagement' &&
      row.currentProgressReportDue.value
        ? labelFrom(ProgressReportStatusLabels)(
            row.currentProgressReportDue.value.status.value
          )
        : null,
    sortComparator: cmpBy((v: string | null) =>
      ProgressReportStatusIndex.get(v)
    ),
    renderCell({ value, row }) {
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
    ...enumColumn(SensitivityList, SensitivityLabels),
    sortComparator: cmpBy<Sensitivity>((v) =>
      simpleSwitch(v, { Low: 0, Medium: 1, High: 2 })
    ),
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

const ProgressReportStatusIndex = mapEntries(
  [null, ...ProgressReportStatusList].entries(),
  ([i, v]) => [!v ? null : ProgressReportStatusLabels[v], i - 1]
).asMap;
