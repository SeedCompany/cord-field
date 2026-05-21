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

export const PrimaryPartnerColumn = <
  const Input extends Merge<
    Partial<GridColDef<Row>>,
    WithValueGetterReturning<PartnerLookupItem | null | undefined, Row>
  >,
  Row extends RowLike
>({
  valueGetter,
  ...overrides
}: Input) =>
  columnWithDefaults<Row>()(overrides, {
    ...textColumn<Row>(),
    headerName: 'Primary Partner',
    width: 300,
    valueGetter: (...args) =>
      valueGetter(...args)?.organization.value?.name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const partner = valueGetter(null as never, row, colDef, { current: api });
      return partner ? (
        <Link to={`/partners/${partner.id}`}>{value}</Link>
      ) : null;
    },
    serverFilter: (value) => ({
      primaryPartnership: { partner: { organization: { name: value } } },
    }),
  });
