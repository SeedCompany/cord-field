import {
  getGridStringOperators,
  GridFilterOperator,
} from '@mui/x-data-grid-pro';
import { column, RowLike } from './definition.types';

export const containsOperator = {
  ...(getGridStringOperators()[0]! as GridFilterOperator<
    any,
    string | null,
    any
  >),
  label: 'search',
  headerLabel: 'search',
};

export const textColumn = <Row extends RowLike>() =>
  column<Row, string | null, any>()({
    filterOperators: [containsOperator],
  });
