import { Link as LinkIcon } from '@mui/icons-material';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
  GridRenderCellParams as RenderCellParams,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { SetOptional } from 'type-fest';
import {
  ProgressReportStatusLabels,
  ProgressReportStatusList,
  ScheduleStatusLabels,
  ScheduleStatusList,
} from '~/api/schema.graphql';
import { CalendarDate, extendSx } from '~/common';
import {
  booleanColumn,
  DefaultDataGridStyles,
  enumColumn,
  noHeaderFilterButtons,
  textColumn,
  useDataGridSource,
} from '~/components/Grid';
import { Link } from '~/components/Routing';
import { ExpansionCell } from './ExpansionCell';
import {
  ProgressReportsDataGridRowFragment as ProgressReport,
  ProgressReportsDocument,
} from './progressReportsDataGridRow.graphql';
import { VariantResponseCell } from './VariantResponseCell';

export type ProgressReportColumnMapShape = Record<
  string,
  SetOptional<GridColDef<ProgressReport>, 'field'>
>;

export const ExpansionMarker = 'expandable';

export const ProgressReportsColumnMap = {
  project: {
    headerName: 'Project',
    field: 'engagement.project.name',
    ...textColumn(),
    width: 200,
    valueGetter: (_, row) => row.parent.project.name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/projects/${row.parent.project.id}`}>{value}</Link>
    ),
    hideable: false,
  },
  language: {
    headerName: 'Language',
    field: 'engagement.language.name',
    ...textColumn(),
    width: 200,
    valueGetter: (_, row) => row.parent.language.value?.name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/languages/${row.parent.language.value?.id}`}>{value}</Link>
    ),
    hideable: false,
  },
  viewReport: {
    headerName: 'Report',
    field: 'id',
    width: 65,
    align: 'center',
    renderCell: ({ row }) => (
      <Tooltip title="View Report">
        <IconButton
          size="small"
          color="primary"
          component={Link}
          to={`/progress-reports/${row.id}`}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    ),
    filterable: false,
    sortable: false,
    hideable: false,
    resizable: false,
  },
  status: {
    headerName: 'Status',
    ...enumColumn(ProgressReportStatusList, ProgressReportStatusLabels, {
      orderByIndex: true,
    }),
    width: 160,
    valueGetter: (_, row) => row.status.value,
  },
  scheduleStatus: {
    field: 'cumulativeSummary.scheduleStatus',
    headerName: 'Progress',
    ...enumColumn(ScheduleStatusList, ScheduleStatusLabels, {
      orderByIndex: true,
    }),
    valueGetter: (_, row) => row.cumulativeSummary?.scheduleStatus,
  },
  cumulativeSummary: {
    headerName: 'Cumulative Progress',
    minWidth: 200,
    sortable: false,
    filterable: false,
    renderCell: ({
      value,
    }: RenderCellParams<
      ProgressReport,
      ProgressReport['cumulativeSummary']
    >) => (
      <Box sx={{ my: 1, display: 'flex', gap: 2 }}>
        <Metric label="Planned" value={value?.planned} />
        <Metric label="Actual" value={value?.actual} />
        <Metric label="Variance" value={value?.variance} />
      </Box>
    ),
  },
  teamNews: {
    headerName: 'Team News',
    width: 400,
    sortable: false,
    filterable: false,
    valueGetter: (_, { teamNews }) =>
      teamNews.items[0]?.responses.findLast((resp) => resp.response.value),
    renderCell: VariantResponseCell,
    cellClassName: ExpansionMarker,
  },
  communityStories: {
    headerName: 'Stories',
    width: 400,
    sortable: false,
    filterable: false,
    valueGetter: (_, { communityStories }) =>
      communityStories.items[0]?.responses.findLast(
        (resp) => resp.response.value
      ),
    renderCell: VariantResponseCell,
    cellClassName: ExpansionMarker,
  },
  varianceExplanation: {
    headerName: 'Explanation of Progress',
    field: 'varianceExplanation.reasons',
    width: 400,
    sortable: false,
    filterable: false,
    valueGetter: (_, { varianceExplanation }) =>
      varianceExplanation.reasons.value[0],
    renderCell: (props) => (
      <Box my={1}>
        <ExpansionCell {...props}>
          <Typography variant="body2">{props.value}</Typography>
        </ExpansionCell>
      </Box>
    ),
    cellClassName: ExpansionMarker,
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
} satisfies ProgressReportColumnMapShape;

export interface ProgressReportsGridProps extends DataGridProps {
  quarter: CalendarDate;
}

export const ProgressReportsGrid = ({
  quarter,
  ...props
}: ProgressReportsGridProps) => {
  const source = useMemo(() => {
    return {
      query: ProgressReportsDocument,
      variables: {
        input: {
          filter: {
            start: {
              afterInclusive: quarter.startOf('quarter'),
            },
            end: {
              beforeInclusive: quarter.endOf('quarter'),
            },
          },
        },
      },
      listAt: 'progressReports',
      initialInput: {
        sort: 'status',
        order: 'DESC',
      },
    } as const;
  }, [quarter]);
  const [dataGridProps] = useDataGridSource({
    ...source,
    apiRef: props.apiRef,
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, props.slots),
    [dataGridProps.slots, props.slots]
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
      slots={slots}
      slotProps={slotProps}
      sx={[noHeaderFilterButtons, ...extendSx(props.sx)]}
    />
  );
};

const Metric = ({ label, value }: { label: string; value?: number }) => (
  <Stack component={Typography} variant="body2">
    <Box component="span" color={value ? undefined : 'text.disabled'}>
      {value === undefined ? '—' : `${(value * 100).toFixed(1)}%`}
    </Box>
    <span>{label}</span>
  </Stack>
);
