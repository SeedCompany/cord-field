import { Box } from '@mui/material';
import {
  GridColDef as ColDef,
  GridValidRowModel as RowLike,
} from '@mui/x-data-grid-pro';
import { Merge } from 'type-fest';
import {
  Sensitivity,
  SensitivityLabels,
  SensitivityList,
} from '~/api/schema.graphql';
import { SensitivityIcon } from '../../Sensitivity';
import {
  columnWithDefaults,
  WithValueGetterReturning,
} from '../ColumnTypes/definition.types';
import { enumColumn } from '../ColumnTypes/enumColumn';

export const SensitivityColumn = <
  const Input extends Partial<
    Merge<
      ColDef<Row>,
      WithValueGetterReturning<{ sensitivity: Sensitivity }, Row>
    >
  >,
  Row extends RowLike
>({
  valueGetter,
  ...overrides
}: Input) =>
  columnWithDefaults<Row>()(overrides, {
    field: 'sensitivity',
    ...enumColumn(SensitivityList, SensitivityLabels, {
      orderByIndex: true,
    }),
    headerName: 'Sensitivity',
    width: 110,
    valueGetter: (...args): Sensitivity =>
      (valueGetter ?? (() => args[1]))(...args).sensitivity,
    renderCell: ({ value }) => (
      <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
        <SensitivityIcon value={value} disableTooltip />
        {value}
      </Box>
    ),
  });
