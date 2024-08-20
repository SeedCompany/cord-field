import {
  GridColDef as ColDef,
  GridValidRowModel as RowModel,
  GridValueGetter as ValueGetter,
} from '@mui/x-data-grid';
import { Nil } from '@seedcompany/common';
import { CalendarDate } from '~/common';

type DateInput = Date | CalendarDate | Nil;
type DateValue = Date | null;

type DateColDef<R extends RowModel = any> = ColDef<R, DateValue, string>;

export const dateColumn = () =>
  ({
    type: 'date',
    valueGetter: dateColumn.valueGetter(defaultValueGetter),
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
