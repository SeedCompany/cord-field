import { Box, Stack, Typography } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
  GridRenderCellParams as RenderCellParams,
} from '@mui/x-data-grid-pro';
import type { GridValidRowModel } from '@mui/x-data-grid/models/gridRows';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { SetOptional, SetRequired } from 'type-fest';
import {
  ProgressReportFilters,
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
import { ProjectLookupItem } from '../../../components/form/Lookup';
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

export const ProjectNameColumn = <R extends GridValidRowModel>({
  valueGetter,
  ...rest
}: SetRequired<GridColDef<R, ProjectLookupItem>, 'valueGetter'>) =>
  ({
    ...textColumn(),
    headerName: 'Project',
    width: 200,
    valueGetter: (...args) => valueGetter(...args).name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const project = valueGetter(null as never, row, colDef, { current: api });
      return <Link to={`/projects/${project.id}`}>{value}</Link>;
    },
    hideable: false,
    ...rest,
  } satisfies Partial<GridColDef<R>>);

export const LanguageNameColumn = <R extends GridValidRowModel>({
  valueGetter,
  ...rest
}: SetRequired<GridColDef<R, ProjectLookupItem>, 'valueGetter'>) =>
  ({
    ...textColumn(),
    headerName: 'Project',
    width: 200,
    valueGetter: (...args) => valueGetter(...args).name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const project = valueGetter(null as never, row, colDef, { current: api });
      return <Link to={`/projects/${project.id}`}>{value}</Link>;
    },
    hideable: false,
    ...rest,
  } satisfies Partial<GridColDef<R>>);

export const ProgressReportIDColumn = <R extends GridValidRowModel>({
  valueGetter,
  ...rest
}: SetRequired<GridColDef<R, ProjectLookupItem>, 'valueGetter'>) =>
  ({
    ...textColumn(),
    headerName: 'Project',
    width: 200,
    valueGetter: (...args) => valueGetter(...args).name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const project = valueGetter(null as never, row, colDef, { current: api });
      return <Link to={`/projects/${project.id}`}>{value}</Link>;
    },
    hideable: false,
    ...rest,
  } satisfies Partial<GridColDef<R>>);

export const ProgressReportIdsColumnMap = {
  project: ProjectNameColumn({
    field: 'engagement.project.name',
    valueGetter: (_, p) => p.parent.project,
  }),
  language: LanguageNameColumn({}),
  viewReport: ProgressReportIDColumn({}),
};

export const ProgressReportsColumnMap = {
  ...ProgressReportIdsColumnMap,
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

function filterForQuarter(quarter: CalendarDate) {
  return {
    start: {
      afterInclusive: quarter.startOf('quarter'),
      // Avoid final reports for projects that end at the end of the quarter.
      // Their start date is the end date.
      // So this ensures there is at least one day in between.
      before: quarter.startOf('quarter').plus({ day: 1 }),
    },
    end: {
      beforeInclusive: quarter.endOf('quarter'),
    },
  } satisfies ProgressReportFilters;
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
            ...filterForQuarter(quarter),
            engagement: {
              project: {
                status: ['Active', 'Completed'],
              },
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
