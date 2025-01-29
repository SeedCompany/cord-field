import { GridColDef } from '@mui/x-data-grid-pro';
import { Merge } from 'type-fest';
import { LanguageLookupItem } from '../../form/Lookup';
import { Link } from '../../Routing';
import {
  columnWithDefaults,
  RowLike,
  WithValueGetterReturning,
} from '../ColumnTypes/definition.types';
import { textColumn } from '../ColumnTypes/textColumn';

export const LanguageNameColumn = <
  const Input extends Merge<
    Partial<GridColDef<Row>>,
    WithValueGetterReturning<LanguageLookupItem, Row>
  >,
  Row extends RowLike
>({
  valueGetter,
  ...overrides
}: Input) =>
  columnWithDefaults<Row>()(overrides, {
    ...textColumn<Row>(),
    headerName: 'Language',
    width: 200,
    valueGetter: (...args) => valueGetter(...args).name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const apiRef = { current: api };
      const language = valueGetter(null as never, row, colDef, apiRef);
      return <Link to={`/languages/${language.id}`}>{value}</Link>;
    },
    hideable: false,
  });
