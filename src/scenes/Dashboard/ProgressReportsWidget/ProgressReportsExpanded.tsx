import { Box } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowId,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo, useState } from 'react';
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
import {
  booleanColumn,
  DefaultDataGridStyles,
  enumColumn,
  flexLayout,
  getInitialVisibility,
  noFooter,
  noHeaderFilterButtons,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  textColumn,
  Toolbar,
  useDataGridSource,
  useFilterToggle,
} from '~/components/Grid';
import { RichTextView } from '~/components/RichText';
import { RoleIcon } from '~/components/RoleIcon';
import { Link } from '~/components/Routing';
import { WidgetHeader } from '~/components/Widgets';
import {
  ProgressReportsDataGridRowFragment,
  ProgressReportsDocument,
} from './progressReportsDataGridRow.graphql';

export const ProgressReportsColumns: Array<
  GridColDef<ProgressReportsDataGridRowFragment>
> = [
  {
    headerName: 'Project',
    field: 'engagement.project.name',
    ...textColumn(),
    width: 200,
    display: 'flex',
    valueGetter: (_, row) => row.parent.project.name.value,
    renderCell: ({ value, row }) => {
      return <Link to={`/projects/${row.parent.project.id}`}>{value}</Link>;
    },
    hideable: false,
  },
  {
    headerName: 'Language',
    field: 'engagement.language.name',
    ...textColumn(),
    width: 200,
    display: 'flex',
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
    width: 160,
    display: 'flex',
    valueGetter: (_, row) => row.status.value,
  },
  {
    headerName: 'Progress',
    field: 'scheduleStatus',
    ...enumColumn(ScheduleStatusList, ScheduleStatusLabels, {
      orderByIndex: true,
    }),
    width: 160,
    display: 'flex',
    sortable: false,
    filterable: false,
    valueGetter: (_, row) => row.varianceExplanation.scheduleStatus,
  },
  {
    headerName: 'Team News',
    field: 'teamNews',
    width: 250,
    sortable: false,
    filterable: false,
    valueGetter: (_, { teamNews }) => {
      return teamNews.items[0]?.responses.findLast((resp) => {
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
      const latestResponse = value.response.value;
      return (
        <Box
          sx={{
            m: 1,
            gap: 1,
            display: 'flex',
            alignItems: 'start',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          <RoleIcon
            variantRole={latestRole}
            sx={{ height: 36, width: 36, m: 0 }}
          />
          <Box
            sx={{
              '& > *:first-child': { maxWidth: 'none' },
            }}
          >
            <RichTextView data={latestResponse} />
          </Box>
        </Box>
      );
    },
  },
  {
    headerName: 'Stories',
    field: 'communityStories',
    width: 250,
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
      const latestResponse = value.response.value;
      return (
        <Box
          sx={{
            m: 1,
            gap: 1,
            display: 'flex',
            alignItems: 'start',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          <RoleIcon
            variantRole={latestRole}
            sx={{ height: 36, width: 36, m: 0 }}
          />
          <Box
            sx={{
              '& > *:first-child': { maxWidth: 'none' },
            }}
          >
            <RichTextView data={latestResponse} />
          </Box>
        </Box>
      );
    },
  },
  {
    headerName: 'Variance Explanation',
    field: 'varianceExplanation.comments',
    width: 250,
    sortable: false,
    filterable: false,
    valueGetter: (_, { varianceExplanation }) => {
      const { comments } = varianceExplanation;
      return comments.value;
    },
    renderCell: ({ value }) => {
      return (
        <Box m={1} display="flex" alignItems="center" gap={1}>
          <RichTextView data={value} />
        </Box>
      );
    },
  },
  {
    field: 'engagement.project.isMember',
    ...booleanColumn(),
    valueGetter: (_, row) => row.parent.project.isMember,
    headerName: 'Mine',
  },
  {
    field: 'engagement.project.pinned',
    ...booleanColumn(),
    valueGetter: (_, row) => row.parent.project.pinned,
    headerName: 'Pinned',
  },
];

export const ProgressReportsInitialState = {
  pinnedColumns: {
    left: ProgressReportsColumns.slice(0, 2).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(ProgressReportsColumns),
      'engagement.project.isMember': false,
      'engagement.project.pinned': false,
    },
  },
} satisfies DataGridProps['initialState'];

export const ProgressReportsExpanded = () => {
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
  const { apiRef } = dataGridProps;
  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: ProgressReportsToolbar,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  const [selected, setSelected] = useState<GridRowId[]>([]);

  const handleRowClick: GridEventListener<'rowClick'> = ({ id }) =>
    selected.length > 0 ? setSelected([]) : setSelected([id]);

  return (
    <Box
      sx={{
        containerType: 'size',
        flex: 1,
        backgroundColor: 'background.paper',
      }}
    >
      <DataGridPro
        {...DefaultDataGridStyles}
        {...dataGridProps}
        density="standard"
        slots={slots}
        slotProps={slotProps}
        columns={ProgressReportsColumns}
        initialState={ProgressReportsInitialState}
        hideFooter
        autoHeight={false}
        onRowClick={handleRowClick}
        rowSelectionModel={selected}
        getRowHeight={(params) =>
          apiRef.current.isRowSelected(params.id) ? 'auto' : undefined
        }
        sx={[
          {
            '&.MuiDataGrid-root .MuiDataGrid-cell': {
              minHeight: 52,
            },
            maxWidth: '100cqw',
            maxHeight: '100cqh',
          },
          flexLayout,
          noHeaderFilterButtons,
          noFooter,
        ]}
      />
    </Box>
  );
};

const ProgressReportsToolbar = () => (
  <Box>
    <WidgetHeader title="Quarterly Reports" to="/dashboard" expand={true} />
    <Toolbar
      sx={{
        justifyContent: 'flex-start',
        gap: 2,
        backgroundColor: 'background.paper',
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
  </Box>
);
