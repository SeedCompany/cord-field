import { Box } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid-pro';
import {
  EngagementFilters,
  ProgressReportFilters,
  ProgressReportStatusLabels,
  ProgressReportStatusList,
  ScheduleStatusLabels,
  ScheduleStatusList,
} from '~/api/schema.graphql';
import { CalendarDate } from '~/common';
import { VariantResponseFragment } from '~/common/fragments';
import { enumColumn, textColumn, useDataGridSource } from '~/components/Grid';
import { RoleIcon } from '~/components/RoleIcon';
import { Link } from '~/components/Routing';
import {
  ProgressReportsDataGridRowFragment,
  ProgressReportsDocument,
} from './progressReportsDataGridRow.graphql';

const ProgressReportsColumns: Array<
  GridColDef<ProgressReportsDataGridRowFragment>
> = [
  {
    headerName: 'Project',
    field: 'project',
    ...textColumn(),
    width: 200,
    flex: 1,
    valueGetter: (_, row) => row.parent.project.name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.parent.project.id}`}>{value}</Link>
    ),
    hideable: false,
  },
  {
    headerName: 'Language',
    field: 'language',
    ...textColumn(),
    width: 200,
    valueGetter: (_, row) => {
      return row.parent.language.value?.name.value;
    },
    renderCell: ({ value, row }) => {
      return (
        <Link to={`/languages/${row.parent.language.value?.id}`}>{value}</Link>
      );
    },
    hideable: false,
    serverFilter: ({ value }) =>
      ({ engagedName: value } satisfies EngagementFilters),
  },
  {
    headerName: 'Status',
    field: 'status',
    ...enumColumn(ProgressReportStatusList, ProgressReportStatusLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) => row.status.value,
    width: 160,
  },
  {
    headerName: 'Progress',
    field: 'scheduleStatus',
    filterable: false,
    sortable: false,
    ...enumColumn(ScheduleStatusList, ScheduleStatusLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) => row.varianceExplanation.scheduleStatus,
    width: 160,
  },
  {
    headerName: 'Team News',
    field: 'teamNews',
    sortable: false,
    filterable: false,
    valueGetter: (_, { teamNews }) => {
      return teamNews.items[0]?.responses.findLast((resp) => {
        return resp.response.value;
      });
    },
    renderCell: ({
      value,
    }: GridRenderCellParams<ProgressReportsDataGridRowFragment>) => {
      if (!value) return null;
      const latestRole = value.variant.responsibleRole;
      return (
        <Box m={1} display="flex" alignItems="center" gap={1}>
          <RoleIcon
            variantRole={latestRole}
            sx={{ height: 36, width: 36, m: 0 }}
          />
        </Box>
      );
    },
  },
  {
    headerName: 'Stories',
    field: 'communityStories',
    sortable: false,
    filterable: false,
    valueGetter: (_, { communityStories }) => {
      return communityStories.items[0]?.responses.findLast((resp) => {
        return resp.response.value;
      });
    },
    renderCell: ({
      value,
    }: GridRenderCellParams<
      ProgressReportsDataGridRowFragment,
      VariantResponseFragment
    >) => {
      if (!value) return null;
      const latestRole = value.variant.responsibleRole;
      return (
        <Box m={1} display="flex" alignItems="center" gap={1}>
          <RoleIcon
            variantRole={latestRole}
            sx={{ height: 36, width: 36, m: 0 }}
          />
        </Box>
      );
    },
  },
];

export const ProgressReportsGrid = (props: Omit<DataGridProps, 'columns'>) => {
  const currentQuarter = CalendarDate.now();

  const currentQuarterRange = {
    start: {
      afterInclusive: currentQuarter.startOf('quarter'),
    },
    end: {
      beforeInclusive: currentQuarter.endOf('quarter'),
    },
  } satisfies ProgressReportFilters;

  const [dataGridProps] = useDataGridSource({
    query: ProgressReportsDocument,
    variables: {},
    listAt: 'progressReports',
    initialInput: {
      sort: 'status',
      filter: {
        ...currentQuarterRange,
      },
    },
  });

  return (
    <DataGridPro
      {...props}
      {...dataGridProps}
      columns={ProgressReportsColumns}
    />
  );
};
