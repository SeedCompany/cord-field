import { SkipNextRounded as SkipIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridRow,
  GridRowProps,
} from '@mui/x-data-grid';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { Link } from 'react-router-dom';
import {
  ProgressReportStatusList as Statuses,
  ProgressReportStatusLabels as StatusLabels,
} from '~/api/schema/enumLists';
import { ProgressReportStatus as Status } from '~/api/schema/schema.graphql';
import { idForUrl } from '../../../components/Changeset';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ProgressReportListItemFragment as ProgressReport } from './ProgressReportListItem.graphql';

export const ProgressReportsTable = ({
  ...props
}: Omit<DataGridProps<ProgressReport>, 'columns'>) => (
  <DataGrid<ProgressReport>
    density="compact"
    initialState={{
      sorting: {
        sortModel: [{ field: 'start', sort: 'desc' }],
      },
    }}
    disableColumnMenu
    disableSelectionOnClick
    autoHeight
    sx={{
      '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
      '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
        '&:focus, &:focus-within': { outline: 'none' },
      },
      '& .MuiDataGrid-columnHeader:nth-last-of-type(-n+2) .MuiDataGrid-columnSeparator--sideRight':
        {
          display: 'none',
        },
    }}
    {...props}
    components={{
      Row: RowLink,
      Footer: () => null,
    }}
    columns={[
      {
        headerName: 'Period',
        field: 'start',
        width: 135,
        renderCell: ({ row: report }) => (
          <Box
            component="span"
            display="inline-flex"
            alignItems="center"
            gap={1}
          >
            <ReportLabel report={report} />
            {report.skippedReason.value && <SkipIcon fontSize="small" />}
          </Box>
        ),
        sortingOrder: ['desc', 'asc'], // no "unsorted"
      },
      {
        headerName: 'Status',
        field: 'status',
        valueGetter: ({ row: { skippedReason, status } }) =>
          skippedReason.value ? 'Skipped' : status.value,
        width: 200,
        renderCell: (params) => {
          const value = params.value as StatusCellVal;
          if (!value) {
            return null;
          }
          if (value === 'Skipped') {
            return value;
          }
          return StatusLabels[value];
        },
        sortComparator: (a: StatusCellVal, b: StatusCellVal) => {
          const toIndex = (val: StatusCellVal) =>
            val == null || val === Statuses[0]
              ? 0
              : val === 'Skipped'
              ? 1
              : Statuses.indexOf(val) + 1;
          return Math.sin(toIndex(a) - toIndex(b));
        },
      },
    ]}
  />
);

type StatusCellVal = 'Skipped' | Status | null;

export const RowLink = (props: GridRowProps) => {
  const report = props.row as ProgressReport;
  return (
    <Typography
      component={Link}
      variant="body2"
      to={`/progress-reports/${idForUrl(report)}`}
      sx={{ textDecoration: 'none' }}
    >
      <GridRow {...props} />
    </Typography>
  );
};
