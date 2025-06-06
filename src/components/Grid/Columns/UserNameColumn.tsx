import { GridColDef } from '@mui/x-data-grid-pro';
import { Merge } from 'type-fest';
import { UserLookupItem } from '../../form/Lookup';
import { Link } from '../../Routing';
import {
  columnWithDefaults,
  RowLike,
  WithValueGetterReturning,
} from '../ColumnTypes/definition.types';
import { textColumn } from '../ColumnTypes/textColumn';

export const UserNameColumn = <
  const Input extends Merge<
    GridColDef<Row>,
    WithValueGetterReturning<UserLookupItem, Row>
  >,
  Row extends RowLike
>({
  valueGetter,
  ...overrides
}: Input) =>
  columnWithDefaults<Row>()(overrides, {
    ...textColumn<Row>(),
    headerName: 'Name',
    width: 350,
    valueGetter: (...args) => valueGetter(...args).fullName,
    renderCell: ({ value, row, colDef, api }) => {
      const user = valueGetter(null as never, row, colDef, { current: api });
      return <Link to={`/users/${user.id}`}>{value}</Link>;
    },
    hideable: false,
  });
