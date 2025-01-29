import {
  getGridSingleSelectOperators,
  GridEditSingleSelectCell,
} from '@mui/x-data-grid-pro';
import { EmptyEnumFilterValue } from '../DefaultDataGridStyles';
import { column, RowLike } from './definition.types';

export const enumColumn = <Row extends RowLike, T extends string>(
  list: readonly T[],
  labels: Record<T, string>,
  { orderByIndex }: { orderByIndex?: boolean } = {}
) =>
  column<Row, T, string>()({
    type: 'singleSelect',
    filterOperators: getGridSingleSelectOperators().filter(
      (op) => op.value !== 'not'
    ),
    valueOptions: list.slice(),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    getOptionLabel: (v) => labels[v as T] ?? EmptyEnumFilterValue,
    valueFormatter: (value: T) => labels[value],
    ...(orderByIndex ? { sortBy: (v) => (v ? list.indexOf(v) : null) } : {}),
    renderEditCell: (params) => (
      <GridEditSingleSelectCell
        {...params}
        // Stop editing on the first value changed.
        // This way users' change will be sent to the server immediately after
        // selecting a new value without needing another interaction.
        onValueChange={async (event, formatted) => {
          const { api, id, field } = params;
          await api.setEditCellValue({ id, field, value: formatted }, event);
          api.stopCellEditMode({ id, field });
        }}
      />
    ),
  });
