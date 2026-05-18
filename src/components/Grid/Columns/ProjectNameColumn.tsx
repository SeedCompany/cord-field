import { GridColDef } from '@mui/x-data-grid-pro';
import { Merge } from 'type-fest';
import { ProjectLookupItem } from '../../form/Lookup';
import { Link } from '../../Routing';
import {
  columnWithDefaults,
  RowLike,
  WithValueGetterReturning,
} from '../ColumnTypes/definition.types';
import { textColumn } from '../ColumnTypes/textColumn';

export const ProjectNameColumn = <
  const Input extends Merge<
    GridColDef<Row>,
    WithValueGetterReturning<ProjectLookupItem, Row>
  >,
  Row extends RowLike
>({
  valueGetter,
  ...overrides
}: Input) =>
  columnWithDefaults<Row>()(overrides, {
    ...textColumn<Row>(),
    headerName: 'Project',
    width: 200,
    valueGetter: (...args) => valueGetter(...args).name.value,
    renderCell: ({ value, row, colDef, api }) => {
      const project = valueGetter(null as never, row, colDef, { current: api });
      return <Link to={`/projects/${project.id}`}>{value}</Link>;
    },
    hideable: false,
  });
