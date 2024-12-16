import { Box } from '@mui/material';
import {
  GridColDef as ColDef,
  GridValidRowModel as RowLike,
  GridValueGetter as ValueGetter,
} from '@mui/x-data-grid-pro';
import {
  Sensitivity,
  SensitivityLabels,
  SensitivityList,
} from '~/api/schema.graphql';
import { Merge } from '~/common';
import { SensitivityIcon } from '../../Sensitivity';
import { enumColumn } from '../ColumnTypes/enumColumn';

export const SensitivityColumn = <
  Row extends RowLike,
  const Input extends Partial<
    ColDef<Row> & {
      valueGetter?: ValueGetter<Row, { sensitivity: Sensitivity }>;
    }
  >
>({
  valueGetter,
  ...rest
}: Input) => {
  const defaults = {
    field: 'sensitivity',
    ...enumColumn(SensitivityList, SensitivityLabels, {
      orderByIndex: true,
    }),
    headerName: 'Sensitivity',
    width: 110,
    valueGetter: (...args) =>
      (valueGetter ?? (() => args[1]))(...args).sensitivity,
    renderCell: ({ value }) => (
      <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
        <SensitivityIcon value={value} disableTooltip />
        {value}
      </Box>
    ),
    hideable: false,
  } as const satisfies Partial<ColDef<Row>>;
  return {
    ...defaults,
    ...rest,
  } as unknown as Merge<typeof defaults, typeof rest>;
};

export const makeColumnDefaults =
  <
    Row extends RowLike,
    const Defaults extends Partial<ColDef<Row>>,
    Input,
    const Overrides extends Partial<ColDef<Row>>
  >(
    defaults: Defaults,
    overrides: (input: Input) => Overrides
  ) =>
  <
    Row extends RowLike,
    const Input extends Partial<
      ColDef<Row> & {
        valueGetter?: ValueGetter<Row, { sensitivity: Sensitivity }>;
      }
    >
  >({
    valueGetter,
    ...rest
  }: Input) => {
    const defaults = {
      field: 'sensitivity',
      ...enumColumn(SensitivityList, SensitivityLabels, {
        orderByIndex: true,
      }),
      headerName: 'Sensitivity',
      width: 110,
      valueGetter: (...args) =>
        (valueGetter ?? (() => args[1]))(...args).sensitivity,
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          textTransform="uppercase"
        >
          <SensitivityIcon value={value} disableTooltip />
          {value}
        </Box>
      ),
      hideable: false,
    } as const satisfies Partial<ColDef<Row>>;
    return {
      ...defaults,
      ...rest,
    } as unknown as Merge<typeof defaults, typeof rest>;
  };
