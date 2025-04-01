import { GridColDef } from '@mui/x-data-grid-pro';
import { Merge } from 'type-fest';
import { PartnerLookupItem } from '../../form/Lookup';
import { Link } from '../../Routing';
import {
  columnWithDefaults,
  RowLike,
  WithValueGetterReturning,
} from '../ColumnTypes/definition.types';
import { textColumn } from '../ColumnTypes/textColumn';

export const PartnerNameColumn = <
  const Input extends Merge<
    GridColDef<Row>,
    WithValueGetterReturning<PartnerLookupItem, Row>
  >,
  Row extends RowLike
>({
  valueGetter,
  ...overrides
}: Input) =>
  columnWithDefaults<Row>()(overrides, {
    ...textColumn<Row>(),
    headerName: 'Partner',
    width: 300,
    valueGetter: (...args) =>
      valueGetter(...args).organization.value?.name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const partner = valueGetter(null as never, row, colDef, { current: api });
      return <Link to={`/partners/${partner.id}`}>{value}</Link>;
    },
    hideable: false,
  });
