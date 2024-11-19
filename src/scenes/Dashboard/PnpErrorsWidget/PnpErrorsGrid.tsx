import { Link as LinkIcon } from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { SetOptional } from 'type-fest';
import { CalendarDate, extendSx } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  booleanColumn,
  DefaultDataGridStyles,
  noHeaderFilterButtons,
  textColumn,
  useDataGridSource,
} from '~/components/Grid';
import { Link } from '~/components/Routing';
import { PnPExtractionProblems } from '../../ProgressReports/PnpValidation/PnPExtractionProblems';
import { PnpExtractionResultFragment as Result } from '../../ProgressReports/PnpValidation/pnpExtractionResult.graphql';
import { PnPExtractionResultDialog } from '../../ProgressReports/PnpValidation/PnpExtractionResultDialog';
import {
  PnpErrorsDataGridRowFragment as PnpError,
  PnpErrorsDocument,
} from './pnpErrorsDataGridRow.graphql';

export type PnpErrorsColumnMapShape = Record<
  string,
  SetOptional<GridColDef<PnpError>, 'field'>
>;

export const ExpansionMarker = 'expandable';

export const PnpErrorsColumnMap = {
  project: {
    headerName: 'Project',
    field: 'parent.project.name',
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
    field: 'parent.language.name',
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
  countError: {
    headerName: 'Errors',
    field: 'pnpExtractionResult.countError',
    type: 'number',
    align: 'right',
    headerAlign: 'center',
    width: 150,
    renderCell: ({ row }) => (
      <ErrorCell
        count={row.pnpExtractionResult!.countError}
        result={row.pnpExtractionResult!}
        engagement={{ id: row.parent.language.value!.id }}
      />
    ),
    filterable: false,
    sortable: false,
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
} satisfies PnpErrorsColumnMapShape;

export interface PnpErrorsGridProps extends DataGridProps {
  quarter: CalendarDate;
}

export const PnpErrorsGrid = ({ quarter, ...props }: PnpErrorsGridProps) => {
  const source = useMemo(() => {
    return {
      query: PnpErrorsDocument,
      variables: {
        input: {
          filter: {
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
            pnpExtractionResult: {
              hasError: true,
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

const ErrorCell = ({
  result,
  engagement,
  count,
}: {
  result: Result;
  engagement: { id: string };
  count: number;
}) => {
  const [dialog, open] = useDialog();
  return (
    <Box>
      <Button size="small" onClick={open}>
        {count}
      </Button>
      <PnPExtractionResultDialog fullWidth {...dialog}>
        <PnPExtractionProblems result={result} engagement={engagement} />
      </PnPExtractionResultDialog>
    </Box>
  );
};
