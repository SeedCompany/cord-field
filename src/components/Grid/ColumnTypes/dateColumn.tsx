import {
  GridColDef as ColDef,
  GridFilterItem as FilterItem,
  getGridDateOperators,
  GridValidRowModel as RowModel,
  GridValueGetter as ValueGetter,
} from '@mui/x-data-grid';
import { isObjectLike, Nil } from '@seedcompany/common';
import { DateTime } from 'luxon';
import { DateFilter } from '~/api/schema.graphql';
import { CalendarDate, ISOString, unwrapSecured } from '~/common';
import { GridHeaderAddFilterButton } from '../GridHeaderAddFilterButton';
import { column, RowLike } from './definition.types';

type DateInput = Date | CalendarDate | ISOString | Nil;
type DateValue = Date | null;

type DateColDef<R extends RowModel = any> = ColDef<R, DateValue, string>;

export const dateColumn = <Row extends RowLike>() =>
  column<Row>()({
    type: 'date',
    valueGetter: dateColumn.valueGetter(defaultValueGetter),
    valueSetter: defaultValueSetter,
    filterOperators,
    renderHeaderFilter: GridHeaderAddFilterButton,
  });

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

    if (DateTime.isDateTime(value)) {
      return value.toJSDate();
    }

    if (typeof value === 'string') {
      return CalendarDate.fromISO(value).toJSDate();
    }
    return value;
  };
const defaultValueGetter: DateValueGetterInput = (_, row, column) =>
  unwrapSecured(row[column.field]);

const defaultValueSetter = <R extends RowModel>(
  raw: Date | null,
  row: R,
  column: ColDef<R>
) => {
  const value = raw ? CalendarDate.fromJSDate(raw) : null;
  const field = row[column.field];
  const wrapSecured =
    isObjectLike(field) &&
    '__typename' in field &&
    typeof field.__typename === 'string' &&
    field.__typename.startsWith('Secured')
      ? { ...field, value }
      : value;
  return { ...row, [column.field]: wrapSecured };
};

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
