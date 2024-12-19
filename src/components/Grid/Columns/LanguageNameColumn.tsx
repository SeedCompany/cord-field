import { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import { SetRequired } from 'type-fest';
import { LanguageLookupItem } from '../../../components/form/Lookup';
import { Link } from '../../../components/Routing';
import { textColumn } from '../ColumnTypes/textColumn';

export const LanguageNameColumn = <R extends GridValidRowModel>({
  valueGetter,
  ...rest
}: SetRequired<GridColDef<R, LanguageLookupItem>, 'valueGetter'>) =>
  ({
    ...textColumn(),
    headerName: 'Language',
    width: 200,
    valueGetter: (...args) => valueGetter(...args).name.value,
    renderCell: ({ value, row }) => (
      <Link to={`/languages/${row.parent.language.value?.id}`}>{value}</Link>
    ),
    hideable: false,
    ...rest,
  } satisfies Partial<GridColDef<R>>);
