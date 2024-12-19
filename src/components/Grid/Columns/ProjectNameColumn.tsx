import { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import { SetRequired } from 'type-fest';
import { ProjectLookupItem } from '../../../components/form/Lookup';
import { Link } from '../../../components/Routing';
import { textColumn } from '../ColumnTypes/textColumn';

export const ProjectNameColumn = <R extends GridValidRowModel>({
  valueGetter,
  ...rest
}: SetRequired<GridColDef<R, ProjectLookupItem>, 'valueGetter'>) =>
  ({
    ...textColumn(),
    headerName: 'Project',
    width: 200,
    valueGetter: (...args) => valueGetter(...args).name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const project = valueGetter(null as never, row, colDef, { current: api });
      return <Link to={`/projects/${project.id}`}>{value}</Link>;
    },
    hideable: false,
    ...rest,
  } satisfies Partial<GridColDef<R>>);
