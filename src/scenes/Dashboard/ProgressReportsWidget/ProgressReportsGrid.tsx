import { Box } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo, useState } from 'react';
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
import { RichTextView } from '~/components/RichText';
import { Link } from '~/components/Routing';
import {
  ProgressReportsDataGridRowFragment as ProgressReport,
  ProgressReportsDocument,
} from './progressReportsDataGridRow.graphql';
import { VariantResponseCell } from './VariantResponseCell';

export type ProgressReportColumnMapShape = Record<
  string,
  SetOptional<GridColDef<ProgressReport>, 'field'>
>;

export const ExpansionMarker = 'multiline';

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
  status: {
    headerName: 'Status',
    ...enumColumn(ProgressReportStatusList, ProgressReportStatusLabels, {
      orderByIndex: true,
    }),
    width: 160,
    valueGetter: (_, row) => row.status.value,
  },
  scheduleStatus: {
    headerName: 'Progress',
    ...enumColumn(ScheduleStatusList, ScheduleStatusLabels),
    sortable: false,
    filterable: false,
    valueGetter: (_, row) => row.varianceExplanation.scheduleStatus,
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
  'varianceExplanation.comments': {
    headerName: 'Variance Explanation',
    width: 250,
    sortable: false,
    filterable: false,
    valueGetter: (_, { varianceExplanation }) =>
      varianceExplanation.comments.value,
    renderCell: ({ value }) => (
      <Box m={1} display="flex" alignItems="center" gap={1}>
        <RichTextView data={value} />
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

export const ProgressReportsGrid = (props: DataGridProps) => {
  const [source] = useState(() => {
    const currentDue = CalendarDate.now().minus({ quarter: 1 });
    return {
      query: ProgressReportsDocument,
      variables: {
        input: {
          filter: {
            start: {
              afterInclusive: currentDue.startOf('quarter'),
            },
            end: {
              beforeInclusive: currentDue.endOf('quarter'),
            },
          },
        },
      },
      listAt: 'progressReports',
      initialInput: {
        sort: 'status',
      },
    } as const;
  });
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
      slots={slots}
      slotProps={slotProps}
      {...props}
      sx={[noHeaderFilterButtons, ...extendSx(props.sx)]}
    />
  );
};
