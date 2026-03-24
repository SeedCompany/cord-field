import { GridColDef } from '@mui/x-data-grid-pro';
import { Merge } from 'type-fest';
import { DisplayFieldRegionFragment } from '~/common';
import { Link } from '../../Routing';
import {
  columnWithDefaults,
  RowLike,
  WithValueGetterReturning,
} from '../ColumnTypes/definition.types';
import { textColumn } from '../ColumnTypes/textColumn';

export const FieldRegionNameColumn = <
  const Input extends Merge<
    Partial<GridColDef<Row>>,
    WithValueGetterReturning<DisplayFieldRegionFragment | null | undefined, Row>
  >,
  Row extends RowLike
>({
  valueGetter,
  ...overrides
}: Input) =>
  columnWithDefaults<Row>()(overrides, {
    ...textColumn<Row>(),
    headerName: 'Field Region',
    width: 250,
    valueGetter: (...args) => valueGetter(...args)?.name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const fieldRegion = valueGetter(null as never, row, colDef, {
        current: api,
      });

      return fieldRegion ? (
        <Link to={`/field-regions/${fieldRegion.id}`}>{value}</Link>
      ) : null;
    },
  });
