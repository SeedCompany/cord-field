import { Box, Button } from '@mui/material';
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
  useDataGridSource,
} from '~/components/Grid';
import { IDColumn } from '~/components/Grid/Columns/IdColumn';
import { LanguageNameColumn } from '~/components/Grid/Columns/LanguageNameColumn';
import { ProjectNameColumn } from '~/components/Grid/Columns/ProjectNameColumn';
import { PnPExtractionProblems } from '../../ProgressReports/PnpValidation/PnPExtractionProblems';
import { PnpExtractionResultFragment as Result } from '../../ProgressReports/PnpValidation/pnpExtractionResult.graphql';
import { PnPExtractionResultDialog } from '../../ProgressReports/PnpValidation/PnpExtractionResultDialog';
import { filterForQuarter } from '../ProgressReportsWidget/ProgressReportsGrid';
import {
  PnpProblemDataGridRowFragment as PnpProblem,
  PnpProblemsDocument,
} from './pnpProblemsDataGridRow.graphql';

export type PnpErrorsColumnMapShape = Record<
  string,
  SetOptional<GridColDef<PnpProblem>, 'field'>
>;

export const ExpansionMarker = 'expandable';

export const PnpErrorsColumnMap = {
  project: ProjectNameColumn<PnpProblem>({
    field: 'engagement.project.name',
    valueGetter: (_, p) => p.parent.project,
  }),
  language: LanguageNameColumn<PnpProblem>({
    field: 'engagement.language.name',
    valueGetter: (_, p) => p.parent.language.value!,
  }),
  viewReport: IDColumn<PnpProblem>({
    field: 'id',
    valueGetter: (_, p) => p,
    title: 'Report',
    destination: (id) => `/progress-reports/${id}`,
  }),
  countError: {
    headerName: 'Errors',
    field: 'pnpExtractionResult',
    type: 'number',
    headerAlign: 'center',
    width: 150,
    valueGetter: (_, row) =>
      row.pnpExtractionResult?.problems.filter((p) => p.severity === 'Error')
        .length,
    renderCell: ({ value, row }) => (
      <ErrorCell
        count={value}
        result={row.pnpExtractionResult!}
        engagement={{ id: row.parent.language.value!.id }}
      />
    ),
    filterable: false,
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
      query: PnpProblemsDocument,
      variables: {
        input: {
          filter: {
            ...filterForQuarter(quarter),
            pnpExtractionResult: {
              errors: true,
            },
          },
        },
      },
      listAt: 'progressReports',
      initialInput: {
        sort: 'engagement.project.name',
        order: 'ASC',
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
