import {
  GridColDef as ColDef,
  GridFilterItem as FilterItem,
  getGridDateOperators,
  GridValidRowModel as RowModel,
  GridValueGetter as ValueGetter,
} from '@mui/x-data-grid';
import { Nil } from '@seedcompany/common';
import { DateFilter } from '~/api/schema.graphql';
import { CalendarDate } from '~/common';
import { GridHeaderAddFilterButton } from '../GridHeaderAddFilterButton';

type DateInput = Date | CalendarDate | Nil;
type DateValue = Date | null;

type DateColDef<R extends RowModel = any> = ColDef<R, DateValue, string>;

export const dateColumn = () =>
  ({
    type: 'date',
    valueGetter: dateColumn.valueGetter(defaultValueGetter),
    filterOperators,
    renderHeaderFilter: GridHeaderAddFilterButton,
  } satisfies Partial<DateColDef>);

type DateValueGetterInput<R extends RowModel = any> = ValueGetter<
  R,
  DateInput,
  string
>;
type DateValueGetter<R extends RowModel = any> = ValueGetter<
  R,
  DateValue,
  string
>;
dateColumn.valueGetter =
  <R extends RowModel>(getter: DateValueGetterInput<R>): DateValueGetter<R> =>
  (...args) => {
    const value: DateInput | string = (getter as DateValueGetter<R>)(...args);
    if (!value) {
      return null;
    }
    if (CalendarDate.isDate(value)) {
      return value.toJSDate();
    }
    if (typeof value === 'string') {
      return CalendarDate.fromISO(value).toJSDate();
    }
    return value;
  };
const defaultValueGetter: DateValueGetterInput = (_, row, column) =>
  row[column.field];

const filterOpNameMap: Record<string, keyof DateFilter> = {
  after: 'after',
  onOrAfter: 'afterInclusive',
  before: 'before',
  onOrBefore: 'beforeInclusive',
  isEmpty: 'isNull',
  isNotEmpty: 'isNull',
};
const filterOperators =
  // The MUI column doesn't add null in the value, but we do.
  (getGridDateOperators() as DateColDef['filterOperators'] & {})
    // filter out operators that don't have an API operation
    .flatMap((operator) => {
      const apiOp = filterOpNameMap[operator.value];
      if (!apiOp) {
        return [];
      }
      return {
        ...operator,
        getAsApiInput: (item: FilterItem) => ({
          [apiOp]:
            apiOp === 'isNull'
              ? item.operator === 'isEmpty'
              : CalendarDate.fromJSDate(item.value).toISO(),
        }),
      };
    });
